import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import React from "react";

import { ChartAxisMode, ChartTypes, DataColumn } from "../utils/prop-types";
import * as Downloads from "../utils/downloads";
import * as Charts from "../utils/charts";

import Animation from "./Animation.react";
import UiControlsButton from "./UiControlsButton.react";
import UiControlsMenu from "./UiControlsMenu.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiRadioList from "./UiRadioList.react";
import UiCombobox from "./UiCombobox.react";
import UiSelect from "./UiSelect.react";

//#region ChartDataTypeSelect

const options = [
  {
    label: "Auto (based on the column type)",
    value: "auto",
  },
  {
    label: "Quantitative",
    value: "quantitative",
  },
  {
    label: "Temporal",
    value: "temporal",
  },
  {
    label: "Ordinal",
    value: "ordinal",
  },
  {
    label: "Nominal",
    value: "nominal",
  },
];

const ChartDataTypeSelect = React.memo(
  (props) => {
    return (
      <UiSelect
        label="Data Type"
        onChange={(value) => props.onChange(value)}
        options={options}
        value={props.value ?? "auto"}
      />
    );
  }
);

ChartDataTypeSelect.displayName = "ChartDataTypeSelect";

ChartDataTypeSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOf([ "auto", "nominal", "quantitative", "ordinal", "temporal" ]),
};

//#endregion

//#region XAxisMenu

const MainAxisMenu = React.forwardRef(
  (props, ref) => {
    return (
      <UiControlsMenu
        className="mr-chart-axis-menu"
        disableHeader
        onClear={props.axisField && props.onAxisReset && (() => props.onAxisReset())}
        ref={ref}
        title={props.title}
      >
        <UiCombobox
          autoFocus
          label={`${props.title} Column`}
          onChange={(item) => props.onAxisFieldChange(item.name)}
          options={props.fullDatasetColumns}
          value={props.axisField}
        />

        <ChartDataTypeSelect
          onChange={(value) => props.onAxisTypeChange(value)}
          value={props.axisType}
        />

        <UiSelect
          label="Sort by"
          value={props.axisOrder ?? "ascending"}
          onChange={(value) => props.onAxisOrderChange(value)}
          options={
            [
              {
                label: "Ascending order",
                value: "ascending",
              },
              {
                label: "Descending order",
                value: "descending",
              },
            ]
          }
        />

        { props.children }
      </UiControlsMenu>
    );
  }
);

MainAxisMenu.displayName = "MainAxisMenu";

MainAxisMenu.propTypes = {
  axisBins: PropTypes.number,
  axisField: PropTypes.string,
  axisOrder: PropTypes.string,
  axisType: PropTypes.string,
  children: PropTypes.node,
  fullDatasetColumns: PropTypes.arrayOf(DataColumn).isRequired,
  onAxisFieldChange: PropTypes.func.isRequired,
  onAxisOrderChange: PropTypes.func.isRequired,
  onAxisReset: PropTypes.func,
  onAxisTypeChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

//#endregion

//#region SecondaryAxisMenu

const SecondaryAxisMenu = React.forwardRef(
  (props, ref) => {
    return (
      <UiControlsMenu
        className="mr-chart-axis-menu"
        disableHeader
        onClear={props.axisMode && (() => props.onAxisReset())}
        ref={ref}
        title={props.title}
      >
        <UiSelect
          autoFocus
          label="Data"
          options={
            [
              {
                label: "Frequency (number of entries)",
                value: "frequency",
              },
              {
                label: "Cumulative (cumulative number of entries)",
                value: "cumulative-frequency",
              },
              {
                label: "Sum of (a numeric column)",
                value: "sum-of",
              },
              {
                label: "Cumulative Sum of (a numeric column)",
                value: "cumulative-sum-of",
              },
              {
                label: "Average of (a numeric column)",
                value: "average-of",
              },
            ]
          }
          onChange={(value) => props.onAxisModeChange(value)}
          size="small"
          value={props.axisMode ?? "frequency"}
          variant="outlined"
        />

        {
          (
            props.axisMode === "sum-of"
            ||
            props.axisMode === "cumulative-sum-of"
            ||
            props.axisMode === "average-of"
          )
          &&
          (
            <UiCombobox
              autoFocus
              label={`${props.title} Column`}
              onChange={(item) => props.onAxisFieldChange(item.name)}
              options={props.fullDatasetColumns.filter((x) => x.isNumeric)}
              value={props.axisField}
            />
          )
        }
      </UiControlsMenu>
    );
  }
);

SecondaryAxisMenu.displayName = "SecondaryAxisMenu";

SecondaryAxisMenu.propTypes = {
  axisField: PropTypes.string,
  axisMode: ChartAxisMode,
  fullDatasetColumns: PropTypes.arrayOf(DataColumn).isRequired,
  onAxisFieldChange: PropTypes.func.isRequired,
  onAxisModeChange: PropTypes.func.isRequired,
  onAxisReset: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

//#endregion

//#region ChartControls

const chartTypes = [
  { label: "Area Chart", value: "area" },
  { label: "Bar Chart", value: "bar" },
  { label: "Circle Chart", value: "circle" },
  { label: "Line Chart", value: "line" },
  { label: "Point", value: "point" },
  { label: "Tick", value: "tick" },
  { label: "Custom", value: "custom" },
];

const stackingTypes = [
  { label: "None", value: "off" },
  { label: "Stacked view", value: "stacked" },
  { label: "Normalised stacked view", value: "normalised" },
  { label: "Row view", value: "facet" },
  { label: "Overlapping row view", value: "overlapping" },
];

const interpolateTypes = [
  { label: "Linear", value: "linear" },
  { label: "Step", value: "step" },
  { label: "Basis", value: "basis" },
  { label: "Cardinal", value: "cardinal" },
  { label: "Monotone", value: "monotone" },
];

export default class ChartControls extends React.PureComponent {

  state = {
    spec: null,
  }

  chartTypeMenu = React.createRef()

  xAxisMenu = React.createRef()

  yAxisMenu = React.createRef()

  vegaSpecMenu = React.createRef()

  handleSpecChange = (event) => {
    const spec = Charts.vegaEditorDataUrlToSpec(event.target.value) || event.target.value;
    this.setState({ spec });
  }

  saveSpecChanges = () => {
    try {
      if (this.state.spec) {
        const json = JSON.parse(this.state.spec);
        this.props.onSpecChange(JSON.stringify(json, null, 2));
      }
      else {
        this.props.onSpecChange(null);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  generateDefaultSpec = () => {
    return `
{
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "data": {
    "url": "${this.props.dataFileUrl ?? "..."}",
    "format": {"type": "csv"}
  },
  "transform": [
    { "sample" : 100 }
  ],
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "${this.props.xAxisField || this.props.fullDatasetColumns.find((_, i) => i === 0)?.name}",
      "type": "nominal"
    },
    "y": {
      "aggregate": "count"
    }
  }
}
    `;
  }

  openInVegaEditor = () => {
    const url = Charts.vegaEditorSpecToDataUrl(this.state.spec || this.generateDefaultSpec());
    Downloads.openUrl(url);
  }

  render() {
    const { props } = this;
    const isStandardChartType = (props.chartType && props.chartType !== "custom");

    return (
      <div className="mr-main-controls">
        <UiDropdownMenu
          button={UiControlsButton}
          icon={<MenuIcon />}
        >
          {/* <UiDropdownMenu.Item
            onClick={props.onEditPane}
          >
            Edit Chart
          </UiDropdownMenu.Item>

          <Divider /> */}

          <UiDropdownMenu.Item
            onClick={props.onDownloadPNG}
          >
            Download as PNG image
          </UiDropdownMenu.Item>
          <UiDropdownMenu.Item
            onClick={props.onDownloadSVG}
          >
            Download as SVG image
          </UiDropdownMenu.Item>
        </UiDropdownMenu>

        <UiControlsButton
          active={props.controls}
          onClick={() => props.onControlsChange(!props.controls)}
        />
        <Animation in={props.controls}>

          {
            (props.chartType === "custom") && (
              <UiControlsMenu
                className="mr-chart-spec-menu"
                onClear={(props.spec) && (() => props.onSpecChange(null))}
                onClose={this.saveSpecChanges}
                onOpen={() => this.setState({ spec: props.spec || "" })}
                ref={this.vegaSpecMenu}
                title="Vega Spec"
              >
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  style={{ marginBottom: 4 }}
                  className="mr-action-buttons"
                >
                  <IconButton
                    onClick={this.openInVegaEditor}
                    size="small"
                    title="Edit in Vega Editor"
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Box>

                <textarea
                  value={this.state.spec}
                  onChange={this.handleSpecChange}
                  placeholder="Enter Vega or Vega-Lite sepc"
                />
              </UiControlsMenu>
            )
          }

          {
            isStandardChartType && (
              <MainAxisMenu
                axisField={props.seriesDataColumn?.name}
                axisOrder={props.seriesOrder}
                axisType={props.seriesType}
                fullDatasetColumns={props.fullDatasetColumns}
                onAxisFieldChange={(field) => props.onSeriesFieldChage(field)}
                onAxisOrderChange={props.onSeriesOrderChange}
                onAxisReset={props.seriesField && props.onSeriesFieldChage}
                onAxisTypeChange={props.onSeriesTypeChange}
                title="Series"
              >
                <UiSelect
                  label="Stacking"
                  value={props.seriesStacking ?? "off"}
                  onChange={props.onSeriesStackingChange}
                  options={stackingTypes}
                />
              </MainAxisMenu>
            )
          }

          {
            isStandardChartType
            &&
            (!props.mainAxisEncoding || props.mainAxisEncoding === "y")
              ?
              (
                <MainAxisMenu
                  axisField={props.yAxisField}
                  axisOrder={props.yAxisOrder}
                  axisType={props.yAxisType}
                  fullDatasetColumns={props.fullDatasetColumns}
                  onAxisFieldChange={(field) => props.onMainAxisFieldChange("yAxisField", field)}
                  onAxisOrderChange={props.onYAxisOrderChange}
                  onAxisReset={() => props.onMainAxisFieldChange("yAxisField")}
                  onAxisTypeChange={props.onYAxisTypeChange}
                  ref={this.yAxisMenu}
                  title="Y Axis"
                />
              )
              :
              (
                <SecondaryAxisMenu
                  axisField={props.yAxisField}
                  axisMode={props.yAxisMode}
                  fullDatasetColumns={props.fullDatasetColumns}
                  onAxisFieldChange={(field) => props.onYAxisFieldChage(field)}
                  onAxisModeChange={props.onYAxisModeChange}
                  onAxisReset={() => props.onMainAxisFieldChange("yAxisField")}
                  ref={this.yAxisMenu}
                  title="Y Axis"
                />
              )
          }

          {
            isStandardChartType
            &&
            (!props.mainAxisEncoding || props.mainAxisEncoding === "x")
              ?
              (
                <MainAxisMenu
                  axisField={props.xAxisField}
                  axisOrder={props.xAxisOrder}
                  axisType={props.xAxisType}
                  fullDatasetColumns={props.fullDatasetColumns}
                  onAxisFieldChange={(field) => props.onMainAxisFieldChange("xAxisField", field)}
                  onAxisOrderChange={props.onXAxisOrderChange}
                  onAxisReset={() => props.onMainAxisFieldChange("xAxisField")}
                  onAxisTypeChange={props.onXAxisTypeChange}
                  ref={this.xAxisMenu}
                  title="X Axis"
                />
              )
              :
              (
                <SecondaryAxisMenu
                  axisField={props.xAxisField}
                  axisMode={props.xAxisMode}
                  fullDatasetColumns={props.fullDatasetColumns}
                  onAxisFieldChange={(field) => props.onXAxisFieldChage(field)}
                  onAxisModeChange={props.onXAxisModeChange}
                  onAxisReset={() => props.onMainAxisFieldChange("xAxisField")}
                  ref={this.xAxisMenu}
                  title="X Axis"
                />
              )
          }

          <UiControlsMenu
            title="Chart Type"
            hideOnClick
            onClear={props.chartType && (() => props.onChartTypeChange())}
            ref={this.chartTypeMenu}
          >
            <UiRadioList
              items={chartTypes}
              onChange={
                (value) => {
                  props.onChartTypeChange(value);
                  if (value) {
                    setTimeout(
                      () => {
                        if (value === "custom") {
                          this.chartTypeMenu.current.close();
                          this.vegaSpecMenu.current.open();
                        }
                        else if (!props.xAxisField && !props.yAxisField) {
                          this.chartTypeMenu.current.close();
                          this.xAxisMenu.current.open();
                        }
                      },
                      16,
                    );
                  }
                }
              }
              value={props.chartType}
            />

            {
              (props.chartType === "area" || props.chartType === "line") && (
                <React.Fragment>
                  <hr />
                  <div className="mr-subheader">
                    Interpolate
                  </div>
                  <UiRadioList
                    items={interpolateTypes}
                    onChange={props.onInterpolateChange}
                    value={props.interpolateType}
                  />
                </React.Fragment>
              )
            }
          </UiControlsMenu>

        </Animation>
      </div>
    );
  }

}

ChartControls.propTypes = {
  chartType: ChartTypes,
  controls: PropTypes.bool.isRequired,
  dataFileUrl: PropTypes.string,
  fullDatasetColumns: PropTypes.arrayOf(DataColumn).isRequired,
  interpolateType: PropTypes.string.isRequired,
  mainAxisEncoding: PropTypes.oneOf([ "x", "y" ]),
  onChartTypeChange: PropTypes.func.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onDownloadPNG: PropTypes.func.isRequired,
  onDownloadSVG: PropTypes.func.isRequired,
  onInterpolateChange: PropTypes.func.isRequired,
  onMainAxisFieldChange: PropTypes.func.isRequired,
  onSeriesFieldChage: PropTypes.func.isRequired,
  onSeriesOrderChange: PropTypes.func.isRequired,
  onSeriesStackingChange: PropTypes.func.isRequired,
  onSeriesTypeChange: PropTypes.func.isRequired,
  onShowSelecttionChange: PropTypes.func.isRequired,
  onSpecChange: PropTypes.func.isRequired,
  onXAxisFieldChage: PropTypes.func.isRequired,
  onXAxisModeChange: PropTypes.func.isRequired,
  onXAxisOrderChange: PropTypes.func.isRequired,
  onXAxisTypeChange: PropTypes.func.isRequired,
  onYAxisFieldChage: PropTypes.func.isRequired,
  onYAxisModeChange: PropTypes.func.isRequired,
  onYAxisOrderChange: PropTypes.func.isRequired,
  onYAxisTypeChange: PropTypes.func.isRequired,
  seriesDataColumn: DataColumn,
  seriesField: PropTypes.string,
  seriesOrder: PropTypes.string,
  seriesStacking: PropTypes.string,
  seriesType: PropTypes.string,
  showSelection: PropTypes.bool,
  spec: PropTypes.string,
  xAxisBins: PropTypes.number,
  xAxisField: PropTypes.string,
  xAxisMode: ChartAxisMode,
  xAxisOrder: PropTypes.string,
  xAxisType: PropTypes.string,
  yAxisField: PropTypes.string,
  yAxisMode: ChartAxisMode,
  yAxisOrder: PropTypes.string,
  yAxisType: PropTypes.string,
};

//#endregion
