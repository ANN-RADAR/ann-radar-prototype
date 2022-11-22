<template>
  <div class="map-mobility-drawing-panel">
    <v-menu
      left
      offset-x
      nudge-left="8px"
      rounded="0"
      :value="drawingActive"
      :close-on-click="false"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{on, attrs}">
        <v-btn-toggle
          tile
          class="drawing-panel-toggle"
          :value="drawingActive"
          @change="$emit('update:drawingActive', $event || false)"
        >
          <v-btn
            fab
            small
            elevation="2"
            v-bind="attrs"
            v-on="on"
            :title="$t('mobilityLocationDrawing.title')"
            :value="true"
          >
            <v-icon>mdi-vector-point-edit</v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>

      <v-sheet class="map-mobility-drawing-options">
        <v-btn-toggle
          tile
          mandatory
          class="drawing-panel-toggle"
          :value="drawingMode"
          @change="$emit('update:drawingMode', $event)"
        >
          <v-btn small value="draw">
            {{ $t('mobilityLocationDrawing.draw') }}
          </v-btn>
          <v-btn small value="erase">
            {{ $t('mobilityLocationDrawing.erase') }}
          </v-btn>
        </v-btn-toggle>

        <div class="map-mobility-isochrones">
          <h4 class="overline">{{ $t('mobility.lastMileDelivery') }}</h4>

          <v-btn-toggle
            tile
            mandatory
            class="drawing-panel-toggle"
            v-model="travelType"
          >
            <v-btn
              v-for="type in travelTypeOptions"
              :key="type.value"
              fab
              small
              :title="type.title"
              :value="type.value"
            >
              <v-icon>{{ type.icon }}</v-icon>
            </v-btn>
          </v-btn-toggle>

          <v-btn
            tile
            small
            @click="fetchIsochrones"
            :disabled="!mobilityLocations.length"
          >
            {{ $t('mobility.calculateIsochrones') }}
          </v-btn>
        </div>
      </v-sheet>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapMutations, mapState} from 'vuex';

import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';

import {TargomoClient} from '@targomo/core';
import {PolygonGeoJsonOptions} from '@targomo/core/typings/api/payload/polygonRequestPayload';
import {transform} from 'ol/proj';
import {GeoJSONFeature} from 'ol/format/GeoJSON';

enum TravelType {
  WALK = 'walk',
  BIKE = 'bike',
  CAR = 'car',
  TRANSIT = 'transit'
}

const travelTypeIcons = {
  [TravelType.WALK]: 'mdi-walk',
  [TravelType.BIKE]: 'mdi-bike',
  [TravelType.CAR]: 'mdi-car',
  [TravelType.TRANSIT]: 'mdi-subway-variant'
};

interface Data {
  travelType: TravelType;
  travelTypeOptions: Array<{title: string; value: TravelType; icon: string}>;
  targomoClient: TargomoClient;
  targomoOptions: PolygonGeoJsonOptions;
}

export default Vue.extend({
  props: {
    drawingActive: {
      type: Boolean,
      required: true
    },
    drawingMode: {
      type: String as PropType<'draw' | 'erase'>,
      required: true
    }
  },
  data(): Data {
    return {
      travelType: TravelType.WALK,
      travelTypeOptions: Object.values(TravelType).map(type => ({
        title: this.$t(`mobility.travelType.${type}`),
        value: type,
        icon: travelTypeIcons[type]
      })),
      targomoClient: new TargomoClient(
        process.env.VUE_APP_TARGOMO_REGION,
        process.env.VUE_APP_TARGOMO_SERVICE_KEY
      ),
      targomoOptions: {
        // Travel edge weights in seconds = 5, 10, 15 and 20 minutes
        travelEdgeWeights: [300, 600, 900, 1200],
        edgeWeight: 'time',
        // use SRID 4326 (longitude and latitude) spatial reference system
        srid: 4326,
        serializer: 'geojson',
        buffer: 0.0002,
        useClientCache: true
      }
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['mobilityLocations'])
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setMobilityIsochrones'
    ]),
    async fetchIsochrones() {
      if (this.mobilityLocations.length) {
        try {
          const sources = this.mobilityLocations.map(({id, x, y}) => {
            const [lng, lat] = transform([x, y], 'EPSG:25832', 'EPSG:4326');
            return {id, lat, lng};
          });

          const isochroneFeatures: Record<string, Array<GeoJSONFeature>> = {};

          for (const source of sources) {
            const result = await this.targomoClient.polygons.fetch([source], {
              ...this.targomoOptions,
              travelType: this.travelType
            });

            isochroneFeatures[source.id] = result.features;
          }

          this.setMobilityIsochrones(isochroneFeatures);
        } catch (error) {
          console.error('Error fetching Targomo isochrone polygons', error);
        }
      }
    }
  }
});
</script>

<style scoped>
.drawing-panel-toggle {
  display: block;
}

.map-mobility-drawing-panel .drawing-panel-toggle >>> .v-btn,
.map-mobility-drawing-options .drawing-panel-toggle >>> .v-btn {
  opacity: 1;
}

.map-mobility-drawing-panel .drawing-panel-toggle >>> .v-item--active,
.map-mobility-drawing-options .drawing-panel-toggle >>> .v-item--active {
  background-color: #1976d1;
  color: white;
}

.map-mobility-drawing-panel
  .drawing-panel-toggle::v-deep.v-btn-toggle
  > .v-btn.v-item--active
  .v-icon,
.map-mobility-drawing-options
  .drawing-panel-toggle::v-deep.v-btn-toggle
  > .v-btn.v-item--active
  .v-icon {
  color: white;
}

.map-mobility-drawing-options .drawing-panel-toggle >>> .v-btn {
  min-height: 32px;
}

.map-mobility-drawing-options {
  display: flex;
  flex-direction: column;
  grid-gap: 4px;
  padding: 8px;
  overflow: hidden;
}

.map-mobility-isochrones {
  margin: 8px 0 4px;
}

.map-mobility-isochrones > h4 {
  padding: 0 4px;
}

.map-mobility-isochrones > .drawing-panel-toggle {
  margin-bottom: 8px;
}
</style>
