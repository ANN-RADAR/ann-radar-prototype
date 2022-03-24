import Geometry from 'ol/geom/Geometry';
import {Options} from 'ol/layer/Layer';
import TileSource from 'ol/source/Tile';
import VectorSource from 'ol/source/Vector';
import {StyleFunction} from 'ol/style/Style';
import {Options as TileSourceOptions} from 'ol/source/TileWMS';
import {Options as VectorSourceOptions} from 'ol/source/Vector';
import {AdminLayerFeatureData, AdminLayerType} from './admin-layers';

export interface LayerBaseOptions<T = TileSourceOptions | VectorSourceOptions>
  extends Omit<
    Options<TileSource | VectorSource<Geometry>>,
    'properties' | 'source'
  > {
  properties: {[x: string]: any}; // eslint-disable-line @typescript-eslint/no-explicit-any
  source?: T;
}

export interface TileLayerOptions extends LayerBaseOptions<TileSourceOptions> {
  type: 'tile';
}

export interface VectorLayerOptions
  extends LayerBaseOptions<VectorSourceOptions> {
  type: 'vector';
  style?: StyleFunction;
}

export type LayerOptions = TileLayerOptions | VectorLayerOptions;

export interface DataLayerOptions {
  sources?: Record<AdminLayerType, VectorSourceOptions>;
  style?: (payload: {
    layerConfig: LayerConfig;
    selectedClassificationIndex: number | undefined;
    adminLayerDataById: Record<string, AdminLayerFeatureData>;
    dataId: string;
  }) => StyleFunction;
}

export interface LayerConfig {
  attributeName: string;
  classification: Array<
    LayerCategoryConfig & {classification?: Array<LayerCategoryConfig>}
  >;
}

export interface LayerCategoryConfig {
  from: number;
  to: number;
  color: string;
}
