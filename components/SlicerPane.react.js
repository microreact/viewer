import PropTypes from "prop-types";
import React from "react";
import { Vega } from "react-vega";
import debounce from "lodash.debounce";

import "../css/slicer-pane.css";
import { exportPNG, exportSVG } from "../utils/charts";
import { downloadDataUrl } from "../utils/downloads";

import DataColumnFilterByValues from "../containers/DataColumnFilterByValues.react";
import SlicerControls from "./SlicerControls.react";
import { ChartDataTable, DataColumn, DataFilter } from "../utils/prop-types";
import { emptyArray } from "../constants";

// const scrollStyle = {
//   overflow: "auto",
// };

class SlicerPane extends React.PureComponent {

  state = {
    vegaError: null,
  }

  vegaRef = React.createRef()

  handleFilterChange = (selection, append) => {
    const { props } = this;
    const field = this.props.dataColumn.name;

    if (selection.length === 0) {
      props.onColumnFilterChange(
        field,
        null,
      );
    }

    else if (props.chartAxisType === "quantitative") {
      const filterRange = [ Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER ];
      if (append && props.filter && props.filter.operator === "between") {
        filterRange[0] = props.filter.value[0];
        filterRange[1] = props.filter.value[1];
      }
      for (const selectedRange of selection) {
        const rangePoints = selectedRange.split("–");
        const rangeStart = parseFloat(rangePoints[0]);
        const rangeEnd = parseFloat(rangePoints[1]);
        if (rangeStart < filterRange[0]) {
          filterRange[0] = rangeStart;
        }
        if (rangeEnd > filterRange[1]) {
          filterRange[1] = rangeEnd;
        }
      }
      props.onColumnFilterChange(
        field,
        "between",
        filterRange,
      );
    }

    else {
      let values = selection;
      if (append && props.filter && props.filter.operator === "in" && props.filter.value) {
        values = Array.from(
          new Set([
            ...selection,
            ...props.filter.value,
          ])
        );
      }
      props.onColumnFilterChange(
        field,
        "in",
        values,
      );
    }
  }

  debouncedFilterChange = debounce(
    this.handleFilterChange,
    200,
  );

  signalListeners = {
    onItemSelect: (_, [ event, item ] = []) => {
      // console.debug(_, event, item)
      const { props } = this;
      event?.stopPropagation();
      if (item) {
        const key = (props.chartAxisType === "quantitative") ? Object.keys(item).find((x) => x.endsWith("_range")) : props.dataColumn.name;
        if (key in item) {
          this.debouncedFilterChange([ item[key] ], event.metaKey || event.ctrilKey);
        }
      }
      else {
        this.debouncedFilterChange([]);
      }
    },
    brush: (_, item) => {
      const { props } = this;
      const field = props.dataColumn.name;
      const selection = (field in item) ? item[field] : emptyArray;
      this.debouncedFilterChange(selection);
    },
  }

  downloadPNG = async () => {
    const dataUrl = await exportPNG(this.vegaRef.current);
    downloadDataUrl(
      dataUrl,
      "data-slicer-chart.png",
      "image/png",
    );
  }

  downloadSVG = async () => {
    const dataUrl = await exportSVG(this.vegaRef.current);
    downloadDataUrl(
      dataUrl,
      "data-slicer-chart.svg",
      "image/svg+xml",
    );
  }

  renderSlicer() {
    const { props } = this;

    if (props.slicerType === "chart" && props.chartSpec) {
      return (
        <Vega
          data={this.props.chartData}
          logLevel={2}
          onError={console.error}
          onParseError={console.error}
          // onNewView={console.debug}
          ref={this.vegaRef}
          signalListeners={this.signalListeners}
          spec={props.chartSpec}
        />
      );
    }

    if (props.slicerType === "values") {
      return (
        <DataColumnFilterByValues
          field={props.dataColumn.name}
          height={props.height - 64}
        />
      );
    }

    return null;
  }

  render() {
    const { props } = this;

    return (
      <div className="mr-slicer">
        {
           this.renderSlicer()
        }

        <SlicerControls
          isReadOnly={props.isReadOnly}
          onDownloadPNG={this.downloadPNG}
          onDownloadSVG={this.downloadSVG}
          onEditPane={props.onEditPane}
          slicerId={props.slicerId}
          slicerType={props.slicerType}
        />

      </div>
    );
  }
}

SlicerPane.propTypes = {
  chartAxisType: PropTypes.string,
  chartData: ChartDataTable.isRequired,
  chartSpec: PropTypes.object,
  dataColumn: DataColumn.isRequired,
  filter: DataFilter,
  height: PropTypes.number.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onColumnFilterChange: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  slicerId: PropTypes.string.isRequired,
  slicerType: PropTypes.string.isRequired,
};

export default SlicerPane;
