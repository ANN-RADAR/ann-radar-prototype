# ann-radar-prototype

ANN RADAR is a decision support tool. It is provided as Open Source Software published under the MIT License.

ANN RADAR has been funded by ICLEI Action Fund (https://iclei-europe.org/funding-opportunities/action-fund/).

ANN RADAR has been developed by a project realised by Hafen City University, Faculty of Urban Planning and Regional Development.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Source Code Hints

### Page Configurations

All configuration files are located in the ann-radar-data bucket in Google Cloud Storage.
Layer configuration

In the file layers_config.json layers and their legends can be configured.
The configuration follows the following scheme:


```json
{
  // Layername please ask developers
  "layerName": {
    // The name of the attribute used to display the layer (optional, only needed for layers that display their own data).
    "attributeName": "XYZ",
    // Legend Points List
    "classification": [
      // Legend point single value: 1 red (#FF0000)
      {
        "from": 1,
        "to": 1,
        "color": "#FF0000"
      },
      // Legend point range: 2 - 10 orange (#FFCC00)
      {
        "from": 2,
        "to": 10,
        "color": "#FFCC00"
      },
      // Legend point range with gradations: 11 - 19 green (#00FF00) with three gradations (fold-out)
      {
        "from": 11,
        "to": 19,
        "color": "#00FF00",
        "classification": [
          {
            "from": 11,
            "to": 13,
            "color": "#00FF004d"
          },
          {
            "from": 14,
            "to": 16,
            "color": "#00FF0099"
          },
          {
            "from": 17,
            "to": 19,
            "color": "#00FF00FF"
          }
        ]
      },
      // Legend point: "20 minutes" blue (#0000FF)
      {
        "from": 20,
        "to": 20,
        "unit": "minutes", // The `unit` value is a translation key. This must be created in the translations.
        "color": "#0000FF"
      }
    ]
  }
}
```

### Sustainability Domains Configuration

The potential_config.json file contains information about the attributes of the potential tables (Solar, Energy Efficiency and Mobility). For each table, the initially visible attributes (columns) can be configured. In addition, the translations of the attribute names (German and English) are maintained here.

```json
{
  "table": {
    "columns": {
      "selected": {
        // List of initially visible attributes for the energy efficiency table
        "energyEfficiency": ["AnzFlur", "mittlFlur", "BGF", ...],
        // List of initially visible attributes for the mobility table
        "mobility": [...],
        // List of initially visible attributes for the solar table
        "solar": [...]
      },
      // Attribute translations
      "translations": {
        "Attributsname": {
          "en": "English Translation of the attribute name",
          "de": "Deutsche Übersetzung des Attributsnamens"
        },
        ...
      }
    }
  }
}
```

### Balanced Scorecards Configuration

The configuration files for the Balanced Scorecards are named as follows:

    Governance: governance_scorecard.json
    Plans: plans_scorecard.json
    Stakeholders: stakeholders_scorecard.json
    Stakeholders Citizens Engagement stakeholders_citizens_engagement.json
    Stakeholders Organizations Engagement stakeholders_organizations_engagement.json
    Urban Data: urban_data_scorecard.json

The configuration files consist of a list of objects. Any number of objects and any number of measures (consisting of id and description) can be stored in them. The objective of the objects is optional.

Example:
```json
[
  {
    "objective": "Objective A",
    "measures": [
      {
        "id": "A1",
        "description": "Measure A1"
      },
      {
        "id": "A2",
        "description": "Measure A2"
      }
    ]
  },
  {
    "measures": [
      {
        "id": "B1",
        "description": "Measure B1"
      },
      {
        "id": "B2",
        "description": "Measure B2"
      }
    ]
  }
]
```
⚠️ Important! The Measure IDs must be unique and may not be changed afterwards, so that an assignment of the entered data is possible.

### Daten
#### Layerdaten

The data of the following layers are also stored in the ann-radar-data bucket in the Google Cloud Storage:

    Building Blocks Net: HH_Baubloecke_Netto.geojson
    Social Monitoring: social_monitoring.geojson
    Buildings Solar Potential: Tiles in folder MVT_Wohngeb_SP_2015
    Buildings specific useful heat demand: Tiles in folder MVT_NW_spez_Gebaeude2018

All other layers are pulled from https://geodienste.hamburg.de.

#### Own Data (ANN RADAR custom data)

Data of the different administration levels (building blocks, statistical areas, district, borough and city) are stored in the Google Cloud Storage Bucket as JSON files under the following names:

    City: city.json
    District: district.json
    Quarter: quarter.json
    Statistical Areas: statistical_area.json
    Building Blocks: building_block.json

#### Translations

The translation files are part of the code base and are stored in the /src/i18n folder as JSON files.



