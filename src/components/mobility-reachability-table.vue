<template>
  <v-data-table
    v-if="layersConfig.mobilityIsochrones"
    :headers="
      layersConfig.mobilityIsochrones.classification.map(val => ({
        text: (val.from + ' ' + $t(`legends.units.${val.unit}`)).trim(),
        sortable: false,
        // value is time range in seconds
        value: (val.from * 60).toString()
      }))
    "
    :items="reachedResidentsByTime"
    class="reachability-table"
  ></v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState} from 'vuex';
import {MapStateToComputed} from '@/types/store';

import multiPolygon from 'turf-multipolygon';
import polygon from 'turf-polygon';
import point from 'turf-point';
import centroid from '@turf/centroid';
import distance from '@turf/distance';
import union from '@turf/union';
import booleanWithin from '@turf/boolean-within';

import GeoJSON from 'ol/format/GeoJSON';
import {GeoJSONFeature} from 'ol/format/GeoJSON';
import {Polygon} from 'ol/geom';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';

import {vectorSourcesOptions} from '@/constants/sources';
import {adminLayers} from '@/constants/admin-layers';
import {AdminLayerType} from '@/types/admin-layers';

import buildingBlockData from '../../public/data/baublöcke.json';

interface Data {
  buildingBlockFeatures: {
    geometry: {coordinates: number[]};
    properties: Record<string, string>;
  }[];
  reachedResidentsByTime: Record<string, number>[];
}

const BUILDING_BLOCK_DATA_RESIDENTS_KEY = 'Bev_311220';
const BUILDING_BLOCK_DATA_ID =
  adminLayers[AdminLayerType.BUILDING_BLOCK].dataId;

export default Vue.extend({
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'layersConfig',
      'mobilityIsochrones'
    ])
  },
  data(): Data {
    return {
      buildingBlockFeatures: [],
      reachedResidentsByTime: []
    };
  },
  created() {
    proj4.defs(
      'EPSG:25832',
      '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    );
    register(proj4);

    fetch(vectorSourcesOptions.BUILDING_BLOCK_NETTO.url as string).then(res => {
      res.json().then(json => {
        this.buildingBlockFeatures = json.features;
      });
    });
  },
  watch: {
    mobilityIsochrones() {
      if (!this.buildingBlockFeatures || !this.buildingBlockFeatures.length) {
        return;
      }

      // reset current calculation
      this.reachedResidentsByTime = [];

      Object.values(this.mobilityIsochrones).forEach(
        (isochroneFeatures: Array<GeoJSONFeature>) => {
          // Filter building blocks to reduce calculation time
          const filteredBuildingBlockGeometries =
            this.filterBuildingBlockFeatures(
              this.buildingBlockFeatures,
              isochroneFeatures
            );

          // Calculate building blocks reached
          const reachedBuildingBlocksByTime =
            this.calculateReachedBuildingBlocksByTime(
              filteredBuildingBlockGeometries,
              isochroneFeatures
            );

          // Retrieve resident counts for reached building blocks
          const reachedResidentsByTime = this.calculateReachedResidentsByTime(
            reachedBuildingBlocksByTime
          );

          this.reachedResidentsByTime = [
            ...this.reachedResidentsByTime,
            reachedResidentsByTime
          ];
        }
      );
    }
  },
  methods: {
    filterBuildingBlockFeatures(
      buildingBlockFeatures: {
        geometry: {coordinates: number[]};
        properties: Record<string, string>;
      }[],
      isochroneFeatures: Array<GeoJSONFeature>
    ) {
      const lastIsochroneFeature =
        isochroneFeatures[isochroneFeatures.length - 1];
      // Merge all isochrone Features into one Polygon
      const mergedIsochronePolygon = isochroneFeatures.reduce(
        (mergedFeatures, feature) =>
          union(
            mergedFeatures,
            multiPolygon(
              feature.geometry.type === 'MultiPolygon'
                ? feature.geometry.coordinates
                : []
            )
          ),
        multiPolygon(
          lastIsochroneFeature.geometry.type === 'MultiPolygon'
            ? lastIsochroneFeature.geometry.coordinates
            : []
        )
      );

      // Calculate center point of isochrone
      const centerOfIsochrone = point(
        centroid(mergedIsochronePolygon).geometry.coordinates
      );

      // Calculcate max distance from isochrone border to center
      const maxDistance = Math.max(
        ...mergedIsochronePolygon.geometry.coordinates
          .flat()
          .map((coordinate: number[]) =>
            distance(centerOfIsochrone, point(coordinate), {
              units: 'meters'
            })
          )
      );

      // Filter building blocks with a higher distance to isochrone center than calculated max distance
      return buildingBlockFeatures
        .map<{geometry: Polygon; buildingBlockId: string} | null>(feature => {
          const geometry = new GeoJSON()
            .readFeature(feature)
            .getGeometry()
            .transform('EPSG:25832', 'EPSG:4326');

          const distanceToCenter = distance(
            centerOfIsochrone,
            point(geometry.flatCoordinates.slice(0, 2)),
            {units: 'meters'}
          );

          if (distanceToCenter < maxDistance) {
            return {
              geometry,
              buildingBlockId: feature.properties[BUILDING_BLOCK_DATA_ID]
            };
          }
          return null;
        })
        .filter(Boolean as unknown as <E>(x: E | null | undefined) => x is E);
    },
    calculateReachedBuildingBlocksByTime(
      buildingBlocks: {geometry: Polygon; buildingBlockId: string}[],
      isochroneFeatures: Array<GeoJSONFeature>
    ) {
      // Sort isochrones by time range ascending
      const sortedIsochroneFeatures = isochroneFeatures.sort(
        (a, b) => (a.properties?.time || 0) - (b.properties?.time || 0)
      );

      // Initialize with time ranges
      let reachedBuildingBlocksByTime: Record<
        string,
        Set<string>
      > = sortedIsochroneFeatures.reduce(
        (
          buildingBlocksByTime: Record<string, Set<string>>,
          isochroneFeature
        ) => {
          const time = isochroneFeature.properties?.time;
          if (time) {
            buildingBlocksByTime[time] = new Set();
          }
          return buildingBlocksByTime;
        },
        {}
      );

      // Check if building block polygons intersect with isochrones
      buildingBlocks.forEach(({geometry, buildingBlockId}) => {
        let blockPolygon: GeoJSONFeature = polygon([]);
        // Check if given geometry is a multi-polygon
        if (isNaN(geometry.getCoordinates()[0][0][0])) {
          blockPolygon = polygon(geometry.getCoordinates().flat());
        } else {
          blockPolygon = polygon(geometry.getCoordinates());
        }

        for (let i = 0; i < sortedIsochroneFeatures.length; i++) {
          const isochroneFeature = sortedIsochroneFeatures[i];
          const time = isochroneFeature.properties?.time;
          const formerTime =
            i > 0 && sortedIsochroneFeatures[i - 1].properties?.time;

          if (
            // Check wether building block already matched isochrone of former time range
            (formerTime &&
              reachedBuildingBlocksByTime[formerTime] &&
              [...reachedBuildingBlocksByTime[formerTime]].includes(
                buildingBlockId
              )) ||
            // Match building block with isochrone
            booleanWithin(blockPolygon, isochroneFeature)
          ) {
            // Add residents count to entry matching current reachability time
            reachedBuildingBlocksByTime[time] = new Set([
              ...reachedBuildingBlocksByTime[time],
              buildingBlockId
            ]);
          }
        }
      });
      return reachedBuildingBlocksByTime;
    },
    calculateReachedResidentsByTime(
      reachedBuildingBlocksByTime: Record<string, Set<string>>
    ) {
      return Object.keys(reachedBuildingBlocksByTime).reduce(
        (reachedResidentsByTime: Record<string, number>, time) => {
          const reachedResidents: number = [
            ...reachedBuildingBlocksByTime[time]
          ].reduce((reachedResidents: number, buildingBlockId: string) => {
            const buildingBlock = buildingBlockData.find(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data => buildingBlockId === data[BUILDING_BLOCK_DATA_ID]
            );
            return (
              reachedResidents +
              (buildingBlock
                ? Number(buildingBlock[BUILDING_BLOCK_DATA_RESIDENTS_KEY])
                : 0)
            );
          }, 0);

          reachedResidentsByTime[time] = reachedResidents;
          return reachedResidentsByTime;
        },
        {}
      );
    }
  }
});
</script>

<style scoped>
.reachability-table {
  height: 100%;
}
</style>
