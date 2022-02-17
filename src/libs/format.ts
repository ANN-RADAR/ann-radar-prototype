// TODO: replace with localization library / use selected locale
export const formatNumber = (value: number): string => {
  return value?.toLocaleString('de-DE');
};
