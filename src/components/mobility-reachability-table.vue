<template>
  <v-data-table
    v-if="layersConfig.mobilityIsochrones"
    :headers="
      layersConfig.mobilityIsochrones.classification.map(val => ({
        text: val.from + ' ' + $t(val.unit || ''),
        sortable: false,
        value: (val.from * 60).toString()
      }))
    "
    :items="Object.values(reachedResidentsByTime)"
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
import booleanIntersects from '@turf/boolean-intersects';

import GeoJSON from 'ol/format/GeoJSON';
import {GeoJSONFeature} from 'ol/format/GeoJSON';
import {Polygon} from 'ol/geom';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';

import {vectorSourcesOptions} from '../constants/sources';

import buildingBlockData from '../../public/data/baublöcke.json';

interface Data {
  buildingBlockFeatures: {
    geometry: {coordinates: []};
    properties: {BBZ: string};
  }[];
  reachedResidentsByTime: Record<string, Record<string, number>>;
}

const BUILDING_BLOCK_DATA_RESIDENTS_KEY = 'Bev_311220';

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
      reachedResidentsByTime: {}
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
    mobilityIsochrones(newMobilityIsochrones) {
      if (!this.buildingBlockFeatures || !this.buildingBlockFeatures.length) {
        return;
      }

      Object.keys(this.reachedResidentsByTime).forEach(id => {
        if (!(id in newMobilityIsochrones)) {
          delete this.reachedResidentsByTime[id];
        }
      });

      Object.keys(newMobilityIsochrones)
        .filter(id => !(id in this.reachedResidentsByTime))
        .forEach(id => {
          const isochroneFeatures = newMobilityIsochrones[id];

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

          this.reachedResidentsByTime = {
            ...this.reachedResidentsByTime,
            [id]: reachedResidentsByTime
          };
        });
    }
  },
  methods: {
    filterBuildingBlockFeatures(
      buildingBlockFeatures: {
        geometry: {coordinates: []};
        properties: {BBZ: string};
      }[],
      isochroneFeatures: Array<GeoJSONFeature>
    ) {
      // Merge all isochrone Features into one Polygon
      const mergedIsochronePolygon = isochroneFeatures.reduce(
        (mergedFeatures, feature) =>
          union(mergedFeatures, multiPolygon(feature.geometry.coordinates)),
        multiPolygon(
          isochroneFeatures[isochroneFeatures.length - 1].geometry.coordinates
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
        .map<{geometry: Polygon; bbz: string} | null>(feature => {
          const geometry = new GeoJSON()
            .readFeature(feature)
            .getGeometry()
            .transform('EPSG:25832', 'EPSG:4326');

          if (
            distance(
              centerOfIsochrone,
              point(geometry.flatCoordinates.slice(0, 2)),
              {
                units: 'meters'
              }
            ) < maxDistance
          ) {
            return {geometry, bbz: feature.properties.BBZ};
          }
          return null;
        })
        .filter(Boolean as unknown as <E>(x: E | null | undefined) => x is E);
    },
    calculateReachedBuildingBlocksByTime(
      buildingBlocks: {geometry: Polygon; bbz: string}[],
      isochroneFeatures: Array<GeoJSONFeature>
    ) {
      let reachedBuildingBlocksByTime: Record<string, Set<string>> = {};

      // Check if building block polygons intersect with isochrones
      buildingBlocks.forEach(({geometry, bbz}) => {
        let blockPolygon: GeoJSONFeature = polygon([]);
        // Check if given geometry is a multi-polygon
        if (isNaN(geometry.getCoordinates()[0][0][0])) {
          blockPolygon = multiPolygon(geometry.getCoordinates());
        } else {
          blockPolygon = polygon(geometry.getCoordinates());
        }

        for (let i = 0; i < isochroneFeatures.length; i++) {
          const isochroneFeature = isochroneFeatures[i];

          if (booleanIntersects(isochroneFeature, blockPolygon)) {
            const time = isochroneFeature.properties?.time;
            if (time) {
              // Add residents count to entry matching current reachability time
              reachedBuildingBlocksByTime[time] = new Set([
                ...(reachedBuildingBlocksByTime[time] || []),
                bbz
              ]);
            }
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
          ].reduce((reachedResidents: number, bbz: string) => {
            const buildingBlock = buildingBlockData.find(
              data => bbz === data.BBZ
            );
            return (
              reachedResidents +
              Number(buildingBlock[BUILDING_BLOCK_DATA_RESIDENTS_KEY])
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
