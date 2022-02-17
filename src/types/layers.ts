import Geometry from 'ol/geom/Geometry';
import {Options} from 'ol/layer/Layer';
import TileSource from 'ol/source/Tile';
import VectorSource from 'ol/source/Vector';
import {StyleFunction} from 'ol/style/Style';
import {Options as TileSourceOptions} from 'ol/source/TileWMS';
import {Options as VectorSourceOptions} from 'ol/source/Vector';

export interface LayerOptions<T = TileSourceOptions | VectorSourceOptions>
  extends Omit<
    Options<TileSource | VectorSource<Geometry>>,
    'properties' | 'source'
  > {
  properties: {[x: string]: any};
  source: T;
  style?: StyleFunction;
}
