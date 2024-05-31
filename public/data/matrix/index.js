export default
{
  "charts": {},
  "datasets": {
    "dataset-1": {
      "id": "dataset-1",
      "file": "data-file",
      "idFieldName": "id"
    },
  },
  "files": {
    "data-file": {
      "blob": "data:text/csv;base64,aWQsYSxiLGMKYSw4LDAsOApiLDYsMiw2CmMsMzQsMzYK",
      "format": "text/csv",
      "id": "data-file",
      "name": "data.csv",
      "size": 33,
      "type": "data"
    },
    "matrix-file": {
      // "blob": "data:text/csv;base64,aWQsYSxiLGMNCmEsMSwyLDMNCmIsNCw1LDYNCmMsNyw4LDk=",
      // "format": "text/csv",
      "blob": [{ "id": "a", "a": 1, "b": 2, "c": 3 }, { "id": "b", "a": 4, "b": 5, "c": 6 }, { "id": "c", "a": 7, "b": 8, "c": 9 }],
      "format": "data",
      "id": "matrix-file",
      "name": "matrix.csv",
      "size": 33,
      "type": "data"
    }
  },
  "filters": {
    "dataFilters": [],
    "chartFilters": [],
    "searchOperator": "includes",
    "searchValue": "",
    "selection": [],
    "selectionBreakdownField": null
  },
  "maps": {},
  "matrices": {
    "matrix-1": {
      "file": "matrix-file",
      "linkColumn": "id"
    }
  },
  "meta": {
    "name": "Unnamed Project",
    "image": "data:image/png;base64,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",
    "timestamp": "2024-01-27T06:41:04.356Z",
    "description": ""
  },
  "networks": {},
  "notes": {},
  "panes": {
    "model": {
      "global": {
        "splitterSize": 2,
        "tabEnableClose": false,
        "tabSetHeaderHeight": 1,
        "tabSetTabStripHeight": 1,
        "tabSetMinWidth": 160,
        "tabSetMinHeight": 160,
        "borderMinSize": 160,
        "borderBarSize": 20,
        "borderEnableDrop": false
      },
      "borders": [
        {
          "type": "border",
          "size": 240,
          "location": "right",
          "children": [
            {
              "type": "tab",
              "id": "--mr-legend-pane",
              "name": "Legend",
              "component": "Legend",
              "enableClose": false,
              "enableDrag": false
            },
            {
              "type": "tab",
              "id": "--mr-selection-pane",
              "name": "Selection",
              "component": "Selection",
              "enableClose": false,
              "enableDrag": false
            },
            {
              "type": "tab",
              "id": "--mr-history-pane",
              "name": "History",
              "component": "History",
              "enableClose": false,
              "enableDrag": false
            },
            {
              "type": "tab",
              "id": "--mr-views-pane",
              "name": "Views",
              "component": "Views",
              "enableClose": false,
              "enableDrag": false
            }
          ]
        }
      ],
      "layout": {
        "type": "row",
        "id": "#a233f481-ace6-4f62-8ba3-d023f39f064c",
        "children": [
          {
            "type": "row",
            "id": "#2e42d9a7-29bb-42ef-b9ad-47363fb2e2e2",
            "children": [
              {
                "type": "tabset",
                "id": "#18c16080-cb36-49d3-8e12-0a2b36584a12",
                "weight": 50,
                "children": [
                  {
                    "type": "tab",
                    "id": "matrix-1",
                    "name": "matrix",
                    "component": "Matrix"
                  }
                ],
                "active": true
              },
              {
                "type": "tabset",
                "id": "#269fd314-52ac-4761-93e4-a2572bc5499a",
                "weight": 50,
                "children": [
                  {
                    "type": "tab",
                    "id": "table-1",
                    "name": "data",
                    "component": "Table"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  "slicers": {},
  "styles": {
    "coloursField": null,
    "colourPalettes": [],
    "defaultColour": "transparent",
    "defaultShape": "circle",
    "colourSettings": {},
    "labelsField": null,
    "legendDirection": "row",
    "shapesField": null,
    "shapePalettes": []
  },
  "tables": {
    "table-1": {
      "displayMode": "cosy",
      "hideUnselected": false,
      "title": "data",
      "paneId": "table-1",
      "columns": [
        {
          "field": "id",
          "fixed": false
        },
        {
          "field": "a",
          "fixed": false
        },
        {
          "field": "b",
          "fixed": false
        },
        {
          "field": "c",
          "fixed": false
        }
      ],
      "file": "data-file"
    },
    "table-2": {
      "displayMode": "cosy",
      "hideUnselected": false,
      "title": "matrix",
      "paneId": "table-2",
      "columns": [
        {
          "field": "id",
          "fixed": false
        },
        {
          "field": "a",
          "fixed": false
        },
        {
          "field": "b",
          "fixed": false
        },
        {
          "field": "c",
          "fixed": false
        }
      ],
      "file": "matrix-file"
    }
  },
  "timelines": {},
  "trees": {},
  "views": [],
  "schema": "https://microreact.org/schema/v1.json"
}