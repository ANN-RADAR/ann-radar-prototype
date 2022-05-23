import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {StyleFunction} from 'ol/style/Style';
import Text from 'ol/style/Text';

const laboratoriesStyle: StyleFunction = feature => {
  const isHidden = feature.get('hidden');

  if (isHidden) {
    return new Style();
  }

  return new Style({
    stroke: new Stroke({
      color: '#ff9800',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255, 152, 0, 0.2)'
    }),
    text: new Text({
      font: '16px Arial',
      text: feature.get('name'),
      fill: new Fill({color: 'black'}),
      stroke: new Stroke({color: '#fff', width: 4})
    })
  });
};

export const getLaboratoriesLayer = () =>
  new VectorLayer({
    source: new VectorSource({wrapX: false}),
    style: laboratoriesStyle
  });
