# Child Maltreatment Risk Map — Texas 2021

An interactive data visualization tool for exploring **child maltreatment risk factors** across Texas counties and ZIP codes, developed in partnership with the Texas Department of Family and Protective Services (DFPS) and UT Health Tyler.

## Overview

This tool lets public health researchers, policymakers, and practitioners explore geographic variation in child maltreatment risk across Texas. Users can search by county or ZIP code to see risk scores and underlying predictive variables for 2016–2019. The visualization includes a choropleth map, contextual data panels, and documentation of all data sources and variable definitions.

## Features

- **County and ZIP code search** with autocomplete
- **Mapbox choropleth map** with hover and click interactions
- **Risk score explorer** — multiple predictive variables including economic, health, and social factors
- **Year selector** — data available for 2016–2019
- **Data sources page** — full methodology and attribution
- **Variable definitions page** — codebook with all model variables

## Tech Stack

- **Mapbox GL JS** — interactive vector tile choropleth map
- **Vanilla JavaScript / jQuery** — search, map interactions, data fetching
- **texashealthdata.com API** — backend data service for county and ZIP lookups
- **Bootstrap** — responsive layout
- **Prism.js** — code highlighting in the about/methodology section

## Data

Source data is from DFPS administrative records and the 2019 risk model codebook (`assets/files/mltrisk2019_codebook.xlsx`). All data is aggregated and anonymized at the county/ZIP level.

## Running Locally

```bash
npx serve .
```

The app calls the `texashealthdata.com` API for data — no local database setup required.
