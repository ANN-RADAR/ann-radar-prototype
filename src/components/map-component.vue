<template>
  <div id="map"></div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import {Feature, Map, MapBrowserEvent, View} from 'ol';
import {MapOptions} from 'ol/PluggableMap';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector';
import {AdminLayerType} from '@/types/admin-layers';

import {
  getMapStyleLayers,
  getAdminAreaLayers,
  getBaseLayers
} from '@/constants/layers';

type Data = {
  map: null | Map;
  mapOptions: MapOptions;
  mapStyleLayers: LayerGroup;
  adminLayers: LayerGroup;
  layers: LayerGroup;
};

export default Vue.extend({
  props: {
    activeLayers: {
      type: Array as PropType<Array<string>>,
      default: null
    },
    selectedFeatures: {
      type: Array as PropType<Array<Feature<Geometry>> | undefined>,
      required: false
    }
  },
  data(): Data {
    const mapStyleLayers = getMapStyleLayers();
    const adminLayers = getAdminAreaLayers();
    const layers = getBaseLayers();

    return {
      map: null,
      mapStyleLayers,
      adminLayers,
      layers,
      mapOptions: {
        target: 'map',
        layers: [mapStyleLayers, adminLayers, layers],
        view: new View({
          projection: 'EPSG:25832',
          zoom: 12,
          minZoom: 9,
          maxZoom: 18,
          center: [565811, 5933977]
        })
      }
    };
  },
  computed: {
    adminLayerType(): AdminLayerType {
      return this.$store.state.adminLayerType;
    },
    mapStyle() {
      return this.$store.state.mapStyle;
    }
  },
  watch: {
    mapStyle(newMapStyleLayer: string) {
      for (const layer of this.mapStyleLayers.getLayers().getArray()) {
        if (layer.get('name') === newMapStyleLayer) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    adminLayerType(newAdminLayerType: string) {
      for (const layer of this.adminLayers.getLayers().getArray()) {
        if (layer.get('name') === newAdminLayerType) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    activeLayers(newActiveLayers: Array<string>) {
      for (const layer of this.layers.getLayers().getArray()) {
        if (newActiveLayers.includes(layer.get('name'))) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    }
  },
  mounted() {
    this.map = new Map(this.mapOptions);

    // Select map features
    this.map.on('click', (event: MapBrowserEvent<UIEvent>) => {
      const coord = this.map?.getCoordinateFromPixel(event.pixel);

      if (!coord) {
        return;
      }

      for (const layer of this.adminLayers.getLayers().getArray() as Array<
        VectorLayer<VectorSource<Geometry>>
      >) {
        if (layer.get('name') === this.adminLayerType) {
          const clickedFeatures = layer
            .getSource()
            .getFeaturesAtCoordinate(coord);

          clickedFeatures.forEach(feature => {
            feature.set('selected', !feature.get('selected'));
          });

          this.$emit(
            'onSelectedFeaturesChanged',
            layer
              .getSource()
              .getFeatures()
              .filter(feature => feature.get('selected'))
          );
        }
      }
      // TODO: Add selected feature id / name to store
    });

    //   // Update the legend
    //   this.map.on('postcompose', () => {
    //     const legendUrls = Object.entries(this.layers).reduce(
    //       (obj, [key, layer]) => {
    //         const sources =
    //           layer instanceof LayerGroup
    //             ? layer.getLayersArray().map(l => l.getSource())
    //             : [layer.getSource()];
    //         obj[key] = sources
    //           .filter(source => source instanceof TileWMS)
    //           .map(source => (source as TileWMS).getLegendUrl() as string);
    //         return obj;
    //       },
    //       {} as {[key: string]: string[]}
    //     );

    //     this.$emit('legendUrls', legendUrls);
    //   });
  }
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
