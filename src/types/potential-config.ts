export interface PotentialConfig {
  table: {
    columns: {
      translations: {
        [key: string]: /* column param */ {
          [key: string]: /* language e.g. en */ string;
        };
      };
      selected: /* initially selected columns */ {
        solar: string[];
        energyEfficiency: string[];
        mobility: string[];
      };
    };
  };
}
