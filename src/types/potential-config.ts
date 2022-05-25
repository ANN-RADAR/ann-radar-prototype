export interface PotentialConfig {
  table: {
    columns: {
      [key: string]: /* column param */ {
        selected: boolean;
        translations: {
          [key: string]: /* language e.g. en */ string;
        };
      };
    };
  };
}
