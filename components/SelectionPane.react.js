import { createSelector } from "reselect";
import DonutSmallIcon from "@material-ui/icons/DonutSmall";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Vega } from "react-vega";

import "../css/selection-pane.css";

import { getGroupedColours } from "../utils/drawing";

import ColoursLegend from "./ColoursLegend.react";
import ShapesLegend from "./ShapesLegend.react";
import UiEmptyState from "./UiEmptyState.react";
import UiSidePaneHeader from "./UiSidePaneHeader.react";
import SelectionChart from "../containers/SelectionChart.react";
import UiCombobox from "./UiCombobox.react";

const onError = (err) => console.error("SelectionChart", err);
const onParseError = (err) => console.error("SelectionChart", err);

class SelectionPane extends React.PureComponent {

  selectionChartSpecSelector = createSelector(
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

  coloursLegendEntriesSelector = createSelector(
    (props) => props.selectedRows,
    (
      rows,
    ) => {
      const unique = {};

      for (const row of rows) {
        const key = row["--microreact-colour"];
        if (key in unique) {
          unique[key].count += 1;
        }
        else {
          unique[key] = {
            count: 1,
            colour: row["--microreact-colour"],
            label: row["--microreact-colour-label"],
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
        <SelectionChart
          signalListeners={this.signalListeners}
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
