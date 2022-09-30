export default {
  "charts": {},
  "datasets": {
    "dataset-1": {
      "file": "data-file-1",
      "idFieldName": "id",
    },
  },
  "files": {
    "data-file-1": {
      "id": "data-file-1",
      "format": "text/csv",
      "name": "data.csv",
      "url": "data/ebola/microreact-project-west-african-ebola-epidemic-data.csv",
      "hash": "c30fb68591a6291b8dcd89069142f38ecddada44",
      "size": 47603,
    },
    "tree-file-1": {
      "id": "tree-file-1",
      "format": "text/x-nh",
      "name": "tree.nwk",
      "url": "data/ebola/microreact-project-west-african-ebola-epidemic-data.nwk",
      "hash": "9b42ef6fc1dd3be6ea3e7184ebb9a173297270db",
      "size": 28497,
    },
  },
  "filters": {},
  "maps": {
    "map-1": {
      "title": "Map",
      "dataType": "geographic-coordinates",
      "coordinate-unit": "decimal-degrees",
      "latitudeField": "latitude",
      "longitudeField": "longitude",
      "viewport": null,
      "lasso": true,
      "path": [
        [
          -8.141422503834576,
          7.114510612729944,
        ],
        [
          -12.831320163374784,
          5.272607329235612,
        ],
        [
          -6.636023255094415,
          4.407212888976176,
        ],
        [
          -8.141422503834576,
          7.114510612729944,
        ],
      ],
    },
  },
  "meta": {
    "name": "West African Ebola epidemic (2013-2016)",
    "description": "Phylogeographic reconstruction of the West African Ebola epidemic based 1610 complete genomes (Dudas et al., Nature, 2017, doi:10.1038/nature22040).",
    "email": "philippe.lemey@kuleuven.be",
    "website": "https://github.com/ebov/space-time",
    "createdAt": "2017-04-13T09:14:35.415Z",
    "updatedAt": "2017-04-13T09:14:35.415Z",
  },
  "networks": {},
  "notes": {},
  "panes": {},
  "styles": {},
  "tables": {
    "table-1": {
      "dataset": "dataset-1",
      "file": "data-file-1",
      "title": "Metadata",
      "columns": [
        {
          "field": "number",
        },
        {
          "field": "id",
        },
        {
          "field": "country",
        },
        {
          "field": "location",
        },
        {
          "field": "locImputation",
        },
        {
          "field": "nonJitLat",
        },
        {
          "field": "nonJitLong",
        },
        {
          "field": "latitude",
        },
        {
          "field": "longitude",
        },
        {
          "field": "collection_date",
        },
        {
          "field": "dateImputation",
        },
        {
          "field": "year",
        },
        {
          "field": "month",
        },
        {
          "field": "day",
        },
      ],
    },
  },
  "timelines": {
    "timeline-1": {
      "title": "Timeline",
      "dataType": "year-month-day",
      "yearField": "year",
      "monthField": "month",
      "dayField": "day",
    },
  },
  "trees": {
    "tree-1": {
      "title": "Tree",
      "file": "tree-file-1",
      "labelField": "id",
    },
  },
  "version": 1,
  "schema": "https://microreact.org/schema/v1.json",
  "_": {
    "id": "west-african-ebola-epidemic",
    "version": 1,
    "url": "https://microreact.org/project/west-african-ebola-epidemic",
    "isOwner": false,
  },
};
