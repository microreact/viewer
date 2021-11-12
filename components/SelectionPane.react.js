import { createSelector } from "reselect";
import DonutSmallIcon from "@material-ui/icons/DonutSmall";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import ListSubheader from "@material-ui/core/ListSubheader";

import "../css/selection-pane.css";

import { getGroupedColours } from "../utils/drawing";

import ColoursLegend from "./ColoursLegend.react";
import ShapesLegend from "./ShapesLegend.react";
import UiEmptyState from "./UiEmptyState.react";
import UiSidePaneHeader from "./UiSidePaneHeader.react";
import SelectionChart from "../containers/SelectionChart.react";
import UiCombobox from "./UiCombobox.react";
import LegendsList from "./LegendsList.react";

class SelectionPane extends React.PureComponent {

  state = {
    selectedColour: null,
  }

  slicesSelector = createSelector(
    (props) => props.selectedRows,
    getGroupedColours,
  );

  coloursLegendEntriesSelector = createSelector(
    (props) => props.selectedRows,
    (_, state) => state.selectedColour,
    (
      rows,
      selectedColour,
    ) => {
      const unique = {};

      for (const row of rows) {
        if (!selectedColour || row["--microreact-colour"] === selectedColour) {
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
      }

      const items = Object.values(unique);

      for (const item of items) {
        item.label = `${item.label} (${item.count})`;
      }

      return items;
    },
  );

  breakdownColoursLegendEntriesSelector = createSelector(
    (props) => props.selectedRows,
    (_, state) => state.selectedColour,
    (props) => props.breakdownField,
    (props) => props.breakdownFieldColourMap,
    (
      rows,
      selectedColour,
      breakdownField,
      breakdownFieldColourMap,
    ) => {
      const unique = {};

      for (const row of rows) {
        if (!selectedColour || row["--microreact-colour"] === selectedColour) {
          const key = breakdownFieldColourMap.get(row[breakdownField]);
          if (key in unique) {
            unique[key].count += 1;
          }
          else {
            unique[key] = {
              count: 1,
              colour: key,
              label: row[breakdownField],
              value: row[0],
            };
          }
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
    (_, state) => state.selectedColour,
    (
      rows,
      selectedColour,
    ) => {
      const unique = {};

      for (const row of rows) {
        if (!selectedColour || row["--microreact-colour"] === selectedColour) {
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
      }

      const items = Object.values(unique);

      for (const item of items) {
        item.label = `${item.label} (${item.count})`;
      }

      return items;
    },
  );

  signalListeners = {
    onItemSelect: (_, [ event, item ]) => {
      this.setState({ selectedColour: item ? item["--microreact-colour"] : null });
    },
  }

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
          label="Details Column"
          onChange={(item) => props.onBreakdownFieldChange(item?.name)}
          options={props.fullDatasetColumns}
          value={props.breakdownField}
          clearable
        />
        <SelectionChart
          signalListeners={this.signalListeners}
        />
      </React.Fragment>
    );
  }

  renderSelectedSlice() {
    const { props, state } = this;

    if (props.selectedRows.length === 0) {
      return null;
    }

    if (!state.selectedColour) {
      return (
        <Typography
          variant="subtitle1"
          color="textSecondary"
        >
          Select a chart slice to see details
        </Typography>
      );
    }

    return (
      <ShapesLegend
        id="selected-chart-slice-legend"
        entries={this.shapesLegendEntriesSelector(props, state)}
      />
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
          (props.breakdownField) && (
            <React.Fragment>
              <ListSubheader component="div">
                Colours Legend
              </ListSubheader>
              <ColoursLegend
                entries={this.breakdownColoursLegendEntriesSelector(props, state)}
                id="selection-breakdown-colours-legend"
                scale="discrete"
              />
            </React.Fragment>
          )
        }
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
