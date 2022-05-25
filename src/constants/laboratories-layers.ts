import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Circle from 'ol/style/Circle';
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

const laboratoriesDrawAreaStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.3)'
  }),
  stroke: new Stroke({
    color: '#f00',
    width: 2
  })
});

const laboratoriesDrawHandleStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.3)'
  }),
  stroke: new Stroke({
    color: '#f00',
    width: 2
  }),
  image: new Circle({
    radius: 5,
    fill: new Fill({color: '#f00'}),
    stroke: new Stroke({color: '#fff', width: 2})
  })
});

const laboratoriesModifyHandleStyle = new Style({
  image: new Circle({
    radius: 7,
    fill: new Fill({color: '#f00'}),
    stroke: new Stroke({color: '#fff', width: 2})
  })
});

export const laboratoriesStyles = {
  laboratoriesDrawAreaStyle,
  laboratoriesDrawHandleStyle,
  laboratoriesModifyHandleStyle
};

export const getLaboratoriesLayer = () =>
  new VectorLayer({
    source: new VectorSource({wrapX: false}),
    style: laboratoriesStyle
  });
