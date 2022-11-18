import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {StyleFunction} from 'ol/style/Style';
import Text from 'ol/style/Text';

// Drawing styles
export const drawHandleStyle = new Style({
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

export const modifyHandleStyle = new Style({
  image: new Circle({
    radius: 8,
    fill: new Fill({color: '#f00'}),
    stroke: new Stroke({color: '#fff', width: 2})
  })
});

// Mobility styles
export const mobilityDrawPointStyle: StyleFunction = feature =>
  new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({color: '#ff9800'}),
      stroke: new Stroke({color: '#fff', width: 2})
    }),
    text: new Text({
      font: '12px Avenir, Helvetica, Arial, sans-serif',
      text: feature.get('name'),
      fill: new Fill({color: 'black'}),
      stroke: new Stroke({color: '#fff', width: 2}),
      offsetY: 1
    })
  });

export const mobilityIsochronesStyle: StyleFunction = feature => {
  let color;

  switch (feature.get('time')) {
    case 300:
      color = '34, 64, 0';
      break;
    case 600:
      color = '78, 115, 36';
      break;
    case 900:
      color = '124, 170, 73';
      break;
    default:
      color = '175, 227, 113';
      break;
  }

  return new Style({
    stroke: new Stroke({
      color: `rgb(${color})`,
      width: 1
    }),
    fill: new Fill({
      color: `rgba(${color}, 0.4)`
    })
  });
};

// Laboratories styles
export const laboratoriesStyle: StyleFunction = feature => {
  const isHidden = feature.get('hidden');
  const isHovered = feature.get('hovered');

  if (isHidden) {
    return new Style();
  }

  return new Style({
    stroke: new Stroke({
      color: '#ff9800',
      width: isHovered ? 3 : 2
    }),
    fill: new Fill({
      color: isHovered ? 'rgba(255, 152, 0, 0.4)' : 'rgba(255, 152, 0, 0.2)'
    }),
    ...(isHovered && {
      text: new Text({
        font: '16px Arial',
        text: feature.get('name'),
        fill: new Fill({color: 'black'}),
        stroke: new Stroke({color: '#fff', width: 4})
      })
    })
  });
};

export const laboratoriesDrawAreaStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.3)'
  }),
  stroke: new Stroke({
    color: '#f00',
    width: 2
  })
});
