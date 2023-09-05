/**
 * Returns a definition list with the feature properties
 * of the feature info XML Response from the Geoportal as string
 */
export const getInfoWindowContentFromXML = (xmlDoc: Document): string => {
  const featureMembers = xmlDoc.getElementsByTagName('gml:featureMember');

  let featureInfo = '<dl>';

  for (const featureMember of featureMembers) {
    const featureElements = [...featureMember.childNodes].filter(
      node => node instanceof Element
    ) as Array<Element>;

    for (const featureElement of featureElements) {
      const title = featureElement.tagName.split(':')[1];
      const propertyElements = [...featureElement.childNodes].filter(
        node => node instanceof Element
      ) as Array<Element>;

      featureInfo += `<dt>${title}</dt>`;

      if (propertyElements.length) {
        featureInfo += '<dd><dl>';

        for (const propertyElement of propertyElements) {
          const key = propertyElement.tagName.split(':')[1];
          const value = propertyElement.innerHTML.trim();

          if (key) {
            featureInfo += `<dt>${key}</dt>`;
          }

          if (value) {
            featureInfo += `<dd>${value}</dd>`;
          }
        }

        featureInfo += '</dl></dt>';
      }
    }
  }

  featureInfo += '</dl>';

  return featureInfo;
};
