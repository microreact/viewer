import { createSelector } from "reselect";
import { vegaLiteToVega } from "../../utils/charts";

import configSelector from "../config";
import paneSizeSelector from "../panes/pane-size";
import colourMapForFieldSelector from "../styles/colour-map-for-field";
import coloursDataColumnSelector from "../styles/colours-data-column";

function colourMapToScale(colourMap) {
  const domain = [];
  const range = [];

  for (const [ value, colour ] of colourMap.entries()) {
    domain.push(value);
    range.push(colour);
  }
  
  return {
    domain,
    range,
  }
}

const selectionChartSpecSelector = createSelector(
  (state) => paneSizeSelector(state, "--mr-selection-pane"),
  (state) => coloursDataColumnSelector(state),
  (state) => configSelector(state),
  (state) => state.filters.selectionBreakdownField,
  (state) => (state.filters.selectionBreakdownField ? colourMapForFieldSelector(state, state.filters.selectionBreakdownField) : null),
  (
    size,
    coloursDataColumn,
    defaults,
    selectionBreakdownField,
    selectionBreakdownColourMap,
  ) => {
    const vlSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v4.json",
      autosize: {
        contains: "padding",
        type: "fit",
      },
      bounds: "flush",
      data: { name: "table" },
      view: { stroke: null },

      height: size.width,
      padding: { left: 0, top: 2, right: 0, bottom: 8 },
      width: size.width - 32,

      layer: [
        {
          transform: [
            {
              aggregate: [
                { op: "sum", field: "--mr-scalar", as: "--mr-selection-colour-frequency" },
              ],
              groupby: [ coloursDataColumn.name, "--microreact-colour" ],
            },
          ],
          mark: { type: "arc", innerRadius: 33, outerRadius: 100 },
          encoding: {
            theta: {
              // aggregate: "count",
              // field: coloursDataColumn.name,
              field: "--mr-selection-colour-frequency",
              type: "quantitative",
              stack: "normalize",
            },
            color: { field: "--microreact-colour", type: "nominal", legend: false, scale: false },
            strokeWidth: {
              value: 2,
            },
            stroke: {
              value: defaults.theme.background.main,
            },
            tooltip: [
              {
                field: coloursDataColumn.name,
                title: coloursDataColumn.name,
                type: "nominal",
              },
              {
                field: "--mr-selection-colour-frequency",
                title: "Number of entries",
                type: "quantitative",
              },
            ],
          },
        },

        // {
        //   data: { name: "table2" },
        //   "mark": {"type": "arc", "innerRadius": 50, "outerRadius": 100 },
        //   "encoding": {
        //     "theta": {"field": "value", "type": "quantitative", "stack": "normalize"},
        //     "color": {"field": "category", "type": "nominal", legend: false}
        //   }
        // }
      ],
    };

    if (selectionBreakdownField) {
      vlSpec.layer.push({
        transform: [
          {
            aggregate: [
              { op: "sum", field: "--mr-scalar", as: "--mr-selection-details-frequency" },
            ],
            groupby: [ coloursDataColumn.name, "--microreact-colour", selectionBreakdownField ],
          },
        ],
        mark: { type: "arc", innerRadius: 66, outerRadius: 100 },
        encoding: {
          theta: {
            field: "--mr-selection-details-frequency",
            type: "quantitative",
            stack: "normalize",
          },
          color: {
            field: selectionBreakdownField,
            type: "nominal",
            scale: colourMapToScale(selectionBreakdownColourMap),
            legend: false,
          },
          strokeWidth: {
            value: 2,
          },
          stroke: {
            value: defaults.theme.background.main,
          },
          tooltip: [
            {
              field: selectionBreakdownField,
              title: selectionBreakdownField,
              type: "nominal",
            },
            {
              field: "--mr-selection-details-frequency",
              title: "Number of entries",
              type: "quantitative",
            },
          ],
        },
      });
    }

    const vgSpec = vegaLiteToVega(vlSpec);

    return vgSpec;
  }
);

export default selectionChartSpecSelector;
