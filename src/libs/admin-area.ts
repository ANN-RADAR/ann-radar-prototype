import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {StyleFunction} from 'ol/style/Style';
import Text from 'ol/style/Text';

export const getAdminAreaStyle =
  (layerName: string, textAttr: string): StyleFunction =>
  feature =>
    feature.get('selected')
      ? new Style({
          stroke: new Stroke({
            color: '#f00',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.1)'
          }),
          text: new Text({
            font: '16px Arial',
            text: feature.get(textAttr),
            fill: new Fill({color: 'black'}),
            stroke: new Stroke({color: '#fee', width: 4})
          }),
          zIndex: 1
        })
      : new Style({
          stroke: new Stroke({
            color: 'rgba(0, 120, 255, 1.0)',
            width: 2
          }),
          text: new Text({
            font: '16px Arial',
            text: feature.get(textAttr),
            fill: new Fill({color: 'black'}),
            stroke: new Stroke({color: '#eee', width: 4})
          })
        });
