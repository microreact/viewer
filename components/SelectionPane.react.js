import { createSelector } from "reselect";
import DonutSmallIcon from "@material-ui/icons/DonutSmall";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Vega } from "react-vega";

import "../css/selection-pane.css";

import { vegaLiteToVega } from "../utils/charts";

import ColoursLegend from "./ColoursLegend.react";
import ShapesLegend from "./ShapesLegend.react";
import UiEmptyState from "./UiEmptyState.react";
import UiSidePaneHeader from "./UiSidePaneHeader.react";
import UiCombobox from "./UiCombobox.react";
import { emptyArray } from "../constants";

const onError = (err) => console.error("SelectionChart", err);
const onParseError = (err) => console.error("SelectionChart", err);

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
  };
}

class SelectionPane extends React.PureComponent {

  selectionChartDataSelector = createSelector(
    (props) => props.selectedRows,
    (props) => props.activeRowsWithStyleFields,
    (
      selectedRows,
    ) => {
      return {
        table: selectedRows ?? emptyArray,
      };
    }
  );

  selectionChartSpecSelector = createSelector(
    (props) => props.selectionPaneSize,
    (props) => props.summaryDataColumn,
    (props) => props.summaryColourMap,
    (props) => props.defaults,
    (
      size,
      summaryDataColumn,
      summaryColourMap,
      defaults,
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

        height: size.width - 32,
        padding: { left: 0, top: 0, right: 0, bottom: 0 },
        width: size.width - 32,

        layer: [
          {
            transform: [
              {
                aggregate: [
                  { op: "sum", field: "--mr-scalar", as: "--mr-selection-colour-frequency" },
                ],
                groupby: [ summaryDataColumn.name ],
              },
            ],
            mark: { type: "arc", innerRadius: 33, outerRadius: 100 },
            encoding: {
              theta: {
                // aggregate: "count",
                // field: summaryDataColumn.name,
                field: "--mr-selection-colour-frequency",
                type: "quantitative",
                stack: "normalize",
              },
              color: {
                field: summaryDataColumn.name,
                type: "nominal",
                legend: false,
                scale: colourMapToScale(summaryColourMap),
              },
              strokeWidth: {
                value: 2,
              },
              stroke: {
                value: defaults.theme.background.main,
              },
              tooltip: [
                {
                  field: summaryDataColumn.name,
                  title: summaryDataColumn.name,
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

      const vgSpec = vegaLiteToVega(vlSpec);

      return vgSpec;
    }
  );

  coloursLegendEntriesSelector = createSelector(
    (props) => props.selectedRows,
    (props) => props.summaryDataColumn,
    (props) => props.summaryColourMap,
    (
      rows,
      summaryDataColumn,
      summaryColourMap,
    ) => {
      const unique = {};

      for (const row of rows) {
        const value = row[summaryDataColumn.name];
        const colour = summaryColourMap.get(value);
        const key = colour;
        if (key in unique) {
          unique[key].count += 1;
        }
        else {
          unique[key] = {
            count: 1,
            colour,
            label: value,
            value,
          };
        }
      }

      const items = Object.values(unique);

      for (const item of items) {
        item.label = `${item.label} (${item.count})`;
      }

      return items;
    },
  );

  shapesLegendEntriesSelector = createSelector(
    (props) => props.selectedRows,
    (
      rows,
    ) => {
      const unique = {};

      for (const row of rows) {
        const key = row["--microreact-shape"];
        if (key in unique) {
          unique[key].count += 1;
        }
        else {
          unique[key] = {
            count: 1,
            shape: row["--microreact-shape"],
            label: row["--microreact-shape-label"],
            value: row[0],
          };
        }
      }

      const items = Object.values(unique);

      for (const item of items) {
        item.label = `${item.label} (${item.count})`;
      }

      return items;
    },
  );

  renderSelectionChart() {
    const { props } = this;

    if (props.selectedRows.length === 0) {
      return (
        <UiEmptyState
          title="No Selection"
          subtitle="Make a selection to see summary"
          icon={<DonutSmallIcon />}
        />
      );
    }

    return (
      <React.Fragment>
        <UiCombobox
          label="Summary Column"
          onChange={(item) => props.onSummaryFieldChange(item?.name)}
          options={props.fullDatasetColumns}
          value={props.summaryDataColumn?.name}
          clearable
        />
        <Vega
          actions={false}
          data={this.selectionChartDataSelector(props)}
          onError={onError}
          onParseError={onParseError}
          spec={this.selectionChartSpecSelector(props)}
        />
      </React.Fragment>
    );
  }

  renderSelectionLegends() {
    const { props, state } = this;

    if (props.selectedRows.length === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <ListSubheader component="div">
          Colours Legend
        </ListSubheader>
        <ColoursLegend
          entries={this.coloursLegendEntriesSelector(props, state)}
          id="selection-colours-legend"
          scale="discrete"
        />

        {
          (props.shapesDataColum) && (
            <React.Fragment>
              <ListSubheader component="div">
                Shapes Legend
              </ListSubheader>
              <ShapesLegend
                id="selection-shapes-legend"
                entries={this.shapesLegendEntriesSelector(props, state)}
              />
            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  }

  render() {
    const { props } = this;

    return (
      <div className="mr-selection-pane">
        <UiSidePaneHeader
          onClose={props.onClose}
          title="Selection Summary"
        />

        <div className="mr-selection-content">
          { this.renderSelectionChart() }
          { this.renderSelectionLegends() }
        </div>

      </div>
    );
  }

}

SelectionPane.displayName = "SelectionPane";

SelectionPane.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelectRows: PropTypes.func.isRequired,
  selectedRows: PropTypes.array.isRequired,
};

export default SelectionPane;
