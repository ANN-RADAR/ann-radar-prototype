// TODO: replace with localization library / use selected locale
export const formatNumber = (value: number): string => {
  return value?.toLocaleString('de-DE');
};

export const formatPotentialValue = (
  dataProperty: string,
  value: string | number | undefined
): string | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }

  if (typeof value !== 'number') {
    return value;
  }

  /* eslint-disable no-irregular-whitespace */
  switch (dataProperty) {
    case 'mittlFlur':
    case 'BGF':
    case 'Wohnfl_WK':
      return `${formatNumber(Math.round(value as number))} m²`;

    case 'SP_GebWB15':
    case 'NW_absdiff':
      return `${formatNumber(value as number)} MWh/a`;

    case 'tatNu_WB_P':
    case 'spezWBd_dP':
      return `${formatNumber(value as number)} %`;

    default:
      return formatNumber(Math.round(value as number));
  }
  /* eslint-enable no-irregular-whitespace */
};
