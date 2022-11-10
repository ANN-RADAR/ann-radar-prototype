import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {StyleFunction} from 'ol/style/Style';
import Text from 'ol/style/Text';

export const getAdminLayerStyle =
  (textAttr: string): StyleFunction =>
  feature => {
    const isSelected = feature.get('selected');
    const isHighlighted = feature.get('highlighted');

    const strokeColor = isSelected ? '#f00' : '#0078ff';
    const strokeWidth = isSelected ? 3 : 2;
    const fillColor = isSelected
      ? 'rgba(255, 0, 0, 0.1)'
      : isHighlighted
      ? 'rgba(0, 120, 255, 0.3)'
      : 'rgba(0, 0, 0, 0)';
    const zIndex = isSelected ? 2 : isHighlighted ? 1 : undefined;

    return new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth
      }),
      fill: new Fill({
        color: fillColor
      }),
      text: new Text({
        font: '16px Arial',
        text: feature.get(textAttr),
        fill: new Fill({color: 'black'}),
        stroke: new Stroke({color: '#fff', width: 4})
      }),
      zIndex
    });
  };
