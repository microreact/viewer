export default 
{
  "charts": {
    "chart-1": {
      "controls": true,
      "interpolate": "linear",
      "seriesStacking": "off",
      "xAxisLabelLimit": 120,
      "yAxisLabelLimit": 30,
      "showSelection": false,
      "title": "Chart",
      "paneId": "chart-1",
      "type": "bar",
      "xAxisField": "Meropenem MIC (centralised re-testing)",
      "facetField": "Country",
      "facetGridColumns": 3,
      "facetGridRows": 2
    },
    "chart-2": {
      "controls": true,
      "interpolate": "linear",
      "seriesStacking": "off",
      "xAxisLabelLimit": 120,
      "yAxisLabelLimit": 30,
      "showSelection": false,
      "title": "Chart",
      "paneId": "chart-2",
      "type": "bar",
      "xAxisField": "Country",
      "seriesField": "ST"
    }
  },
  "datasets": {
    "dataset-1": {
      "file": "data-file-1",
      "idFieldName": "id",
      "id": "dataset-1"
    }
  },
  "files": {
    "data-file-1": {
      "id": "data-file-1",
      "size": 101127,
      "name": "data.csv",
      "format": "text/csv",
      "type": "data",
      "url": "https://microreact.org/api/files/raw?56b547d41c6fcf579d6dfba00a45725b64c29bed"
    },
    "tree-file-1": {
      "id": "tree-file-1",
      "size": 35254,
      "name": "tree.nwk",
      "format": "text/x-nh",
      "type": "tree",
      "url": "https://microreact.org/api/files/raw?c982473fb1bb432f29289acd54af904163870903"
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
  "maps": {
    "map-1": {
      "controls": false,
      "dataType": "geographic-coordinates",
      "grouped": true,
      "groupMarkersByRegion": false,
      "lasso": false,
      "markersOpacity": 100,
      "maxNodeSize": 64,
      "minNodeSize": 4,
      "nodeSize": 14,
      "path": null,
      "regionsColourField": null,
      "regionsColourMethod": "entries",
      "regionsColourOpacity": 100,
      "regionsColourPalette": "ColorBrewer YlOrBr-2",
      "scaleMarkers": false,
      "scaleType": "logarithmic",
      "showMarkers": true,
      "showRegionOutlines": true,
      "showRegions": true,
      "style": "",
      "tileLayerDialog": false,
      "tileLayerOpts": null,
      "tileLayerUrl": null,
      "trackViewport": false,
      "type": "mapbox",
      "title": "Map",
      "coordinate-unit": "decimal-degrees",
      "latitudeField": "latitude",
      "longitudeField": "longitude",
      "viewport": null
    }
  },
  "meta": {
    "name": "K. pneumoniae, EuSCAPE 2013-14",
    "description": "",
    "email": null,
    "website": null,
    "image": "data:image/png;base64,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",
    "timestamp": "2023-04-27T10:38:13.978Z",
    "createdAt": "2022-10-28T10:25:25.881Z",
    "updatedAt": "2022-10-28T10:26:11.792Z"
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
          "selected": 0,
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
        "id": "#9abe879f-5ecf-4108-9783-e21f538ecce8",
        "children": [
          {
            "type": "row",
            "id": "#253d4f2d-f22a-4ef8-9580-8f84d8d2dad7",
            "children": [
              {
                "type": "row",
                "id": "#511e7a2c-1e1e-4329-b9f9-9b433ddc1d86",
                "weight": 64,
                "children": [
                  {
                    "type": "tabset",
                    "id": "#88c00185-134b-4173-b534-db086772e785",
                    "weight": 50,
                    "selected": 1,
                    "children": [
                      {
                        "type": "tab",
                        "id": "map-1",
                        "name": "Map",
                        "component": "Map"
                      },
                      {
                        "type": "tab",
                        "id": "chart-1",
                        "name": "Chart",
                        "component": "Chart"
                      }
                    ],
                    "active": true,
                    "maximized": true
                  },
                  {
                    "type": "tabset",
                    "id": "#29c6ad75-332d-42c9-af65-9e2b8308becf",
                    "weight": 50,
                    "selected": 1,
                    "children": [
                      {
                        "type": "tab",
                        "id": "chart-2",
                        "name": "Chart",
                        "component": "Chart"
                      },
                      {
                        "type": "tab",
                        "id": "tree-1",
                        "name": "Tree",
                        "component": "Tree"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "tabset",
                "id": "#a64fdf44-310e-4e19-b1a6-bd2763934032",
                "weight": 48,
                "children": [
                  {
                    "type": "tab",
                    "id": "table-1",
                    "name": "Metadata",
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
    "coloursField": "Sample type",
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
      "dataset": "dataset-1",
      "file": "data-file-1",
      "title": "Metadata",
      "columns": [
        {
          "field": "Carbapenem resistance mechanism"
        },
        {
          "field": "id"
        },
        {
          "field": "EuSCAPE ID"
        },
        {
          "field": "Sample name (as submitted by NEL)"
        },
        {
          "field": "Run accession"
        },
        {
          "field": "Assembly accession"
        },
        {
          "field": "Isolate type, as submitted by NEL"
        },
        {
          "field": "Meropenem MIC (centralised re-testing)"
        },
        {
          "field": "Country"
        },
        {
          "field": "Sample type"
        },
        {
          "field": "Clinical importance"
        },
        {
          "field": "Epidemiological context"
        },
        {
          "field": "Species"
        },
        {
          "field": "ST"
        },
        {
          "field": "latitude"
        },
        {
          "field": "longitude"
        },
        {
          "field": "Hospital code"
        },
        {
          "field": "Previous hospital admission in last 6 months"
        },
        {
          "field": "Previous travel or stay abroad in another country within last 6 months"
        },
        {
          "field": "K-type (capsular loci)"
        },
        {
          "field": "Presence/absence of nif operon (>=16/20 nif genes)"
        },
        {
          "field": "Presence/absence of KPC-like by PCR"
        },
        {
          "field": "Presence/absence of KPC-like in silico"
        },
        {
          "field": "KPC-like variant (in silico)"
        },
        {
          "field": "Presence/absence of NDM-like by PCR"
        },
        {
          "field": "Presence/absence of NDM-like in silico"
        },
        {
          "field": "NDM-like variant (in silico)"
        },
        {
          "field": "Presence/absence of VIM-like by PCR"
        },
        {
          "field": "Presence/absence of VIM-like in silico"
        },
        {
          "field": "VIM-like variant (in silico)"
        },
        {
          "field": "Presence/absence of OXA-48-like by PCR"
        },
        {
          "field": "Presence/absence of OXA-48-like in silico"
        },
        {
          "field": "OXA-48-like variant (in silico)"
        },
        {
          "field": "Presence/absence of IMP-like in silico"
        },
        {
          "field": "IMP-like variant (in silico)"
        },
        {
          "field": "Presence of one or more carbapenemases in silico"
        },
        {
          "field": "Presence/absence of ESBL"
        },
        {
          "field": "ESBL variant"
        },
        {
          "field": "Presence/absence of AmpC"
        },
        {
          "field": "AmpC variant"
        },
        {
          "field": "ompK35 functionality"
        },
        {
          "field": "ompK36 functionality"
        },
        {
          "field": "Colistin resistance"
        },
        {
          "field": "Presence/absence of rmpA"
        },
        {
          "field": "Presence/absence of rmpA2"
        },
        {
          "field": "Presence/absence of mrk (5 major subunits)"
        },
        {
          "field": "Presence/absence of yersiniabactin (>=10/11 genes)"
        },
        {
          "field": "Presence/absence of colibactin (>=17/18 genes)"
        },
        {
          "field": "Presence/absence of microcin (9 genes)"
        },
        {
          "field": "Presence/absence of allantoinase (>=15/16 genes)"
        },
        {
          "field": "Presence/absence of aerobactin (5 genes)"
        },
        {
          "field": "Presence/absence of salmochelin (4 genes)"
        },
        {
          "field": "Presence/absence of ferric uptake operon (3 genes)"
        },
        {
          "field": "Presence/absence of kvg two-component regulator"
        },
        {
          "field": "Blank"
        }
      ]
    }
  },
  "timelines": {},
  "trees": {
    "tree-1": {
      "alignLabels": true,
      "blockHeaderFontSize": 13,
      "blockPadding": 0,
      "blocks": [],
      "blockSize": 14,
      "branchLengthsDigits": 4,
      "controls": false,
      "fontSize": 16,
      "hideOrphanDataRows": false,
      "ids": null,
      "internalLabelsFilterRange": [
        0,
        100
      ],
      "internalLabelsFontSize": 13,
      "lasso": false,
      "nodeSize": 14,
      "path": null,
      "roundBranchLengths": true,
      "scaleLineAlpha": true,
      "showBlockHeaders": true,
      "showBlockLabels": false,
      "showBranchLengths": false,
      "showEdges": true,
      "showInternalLabels": false,
      "showLabels": true,
      "showLeafLabels": false,
      "showPiecharts": true,
      "showShapeBorders": true,
      "showShapes": true,
      "styleLeafLabels": false,
      "styleNodeEdges": false,
      "subtreeIds": null,
      "type": "rc",
      "title": "Tree",
      "file": "tree-file-1",
      "labelField": "id",
      "highlightedId": null
    }
  },
  "views": [],
  "schema": "https://microreact.org/schema/v1.json"
}