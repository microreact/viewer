import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import React from "react";

import { ChartAxisMode, ChartTypes, DataColumn } from "../utils/prop-types";
import * as Downloads from "../utils/downloads";
import * as Charts from "../utils/charts";

import MultipleDataColumnsSelect from "./MultipleDataColumnsSelect.react";
import UiAnimation from "./UiAnimation.react";
import UiControlsButton from "./UiControlsButton.react";
import UiControlsMenu from "./UiControlsMenu.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiRadioList from "./UiRadioList.react";
import UiCombobox from "./UiCombobox.react";
import UiSelect from "./UiSelect.react";

//#region ChartDataTypeSelect

const options = [
  {
    label: "Auto",
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

const axisBinsOptions = [
  {
    label: "Unbinned",
    value: 0,
  },
];
for (let index = 2; index <= 48; index++) {
  axisBinsOptions.push({
    label: `${index} bins`,
    value: index,
  });
}

const axisSortOptions = [
  {
    label: "Ascending order",
    value: "ascending",
  },
  {
    label: "Descending order",
    value: "descending",
  },
];

const axisLabelAngleOptions = [
  {
    label: "Horizontal",
    value: 0,
  },
  {
    label: "Diagonal",
    value: -45,
  },
  {
    label: "Vertical",
    value: -90,
  },
];

const axisLabelLimitOptions = [
  {
    label: "10px",
    value: 10,
  },
  {
    label: "20px",
    value: 20,
  },
  {
    label: "30px",
    value: 30,
  },
  {
    label: "60px",
    value: 60,
  },
  {
    label: "80px",
    value: 80,
  },
  {
    label: "100px",
    value: 100,
  },
  {
    label: "120px",
    value: 120,
  },
  {
    label: "180px",
    value: 180,
  },
  {
    label: "240px",
    value: 240,
  },
  {
    label: "300px",
    value: 300,
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

//#region Main Axis Menu

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

        {
          (!props.hideAxisType) && (
            <ChartDataTypeSelect
              onChange={(value) => props.onAxisTypeChange(value)}
              value={props.axisType}
            />
          )
        }

        {
          (props.axisMaxBins !== undefined) && (
            <UiSelect
              label="Maximum number of bins"
              onChange={props.onAxisMaxBinsChange}
              options={axisBinsOptions}
              value={props.axisMaxBins ?? 0}
            />
          )
        }

        <UiSelect
          label="Sort by"
          value={props.axisOrder ?? "ascending"}
          onChange={props.onAxisOrderChange}
          options={axisSortOptions}
        />

        {
          (typeof props.axisLabelAngle === "number") && (
            <UiSelect
              label="Label angle"
              value={props.axisLabelAngle}
              onChange={props.onAxisLabelAngleChange}
              options={axisLabelAngleOptions}
            />
          )
        }

        {
          (typeof props.axisLabelLimit === "number") && (
            <UiSelect
              label="Max label size"
              value={props.axisLabelLimit}
              onChange={props.onAxisLabelLimitChange}
              options={axisLabelLimitOptions}
            />
          )
        }

        { props.children }
      </UiControlsMenu>
    );
  }
);

MainAxisMenu.displayName = "MainAxisMenu";

MainAxisMenu.propTypes = {
  axisField: PropTypes.string,
  axisLabelAngle: PropTypes.number,
  axisLabelLimit: PropTypes.number,
  axisMaxBins: PropTypes.number,
  axisOrder: PropTypes.string,
  axisType: PropTypes.string,
  children: PropTypes.node,
  fullDatasetColumns: PropTypes.arrayOf(DataColumn).isRequired,
  hideAxisType: PropTypes.bool,
  onAxisFieldChange: PropTypes.func.isRequired,
  onAxisLabelAngleChange: PropTypes.func,
  onAxisLabelLimitChange: PropTypes.func,
  onAxisMaxBinsChange: PropTypes.func,
  onAxisOrderChange: PropTypes.func.isRequired,
  onAxisReset: PropTypes.func,
  onAxisTypeChange: PropTypes.func,
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

        {
          (typeof props.axisLabelLimit === "number") && (
            <UiSelect
              label="Max label size"
              value={props.axisLabelLimit}
              onChange={props.onAxisLabelLimitChange}
              options={axisLabelLimitOptions}
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
  axisLabelLimit: PropTypes.number,
  axisMode: ChartAxisMode,
  fullDatasetColumns: PropTypes.arrayOf(DataColumn).isRequired,
  onAxisFieldChange: PropTypes.func.isRequired,
  onAxisLabelLimitChange: PropTypes.func,
  onAxisModeChange: PropTypes.func.isRequired,
  onAxisReset: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

//#endregion

//#region ChartControls

export const chartTypeOptions = [
  { label: "Area Chart", value: "area" },
  { label: "Bar Chart", value: "bar" },
  { label: "Circle Chart", value: "circle" },
  { label: "Line Chart", value: "line" },
  { label: "Heatmap", value: "heatmap" },
  { label: "Multi-variable Bar Chart", value: "multi-variable-bar" },
  { label: "Pie Chart", value: "piechart" },

  { label: "Point", value: "point" },
  { label: "Tick", value: "tick" },
  // { label: "Heatmap Matrix", value: "heatmap" },
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
  { label: "Step before", value: "step-before" },
  { label: "Step after", value: "step-after" },
  { label: "Basis", value: "basis" },
  { label: "Cardinal", value: "cardinal" },
  { label: "Monotone", value: "monotone" },
];

const gridOptions = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 10 },
  { value: 12 },
  { value: 15 },
  { value: 20 },
  { value: 25 },
  { value: 30 },
];

export default class ChartControls extends React.PureComponent {

  state = {
    spec: null,
  };

  chartTypeMenu = React.createRef();

  xAxisMenu = React.createRef();

  yAxisMenu = React.createRef();

  vegaSpecMenu = React.createRef();

  handleSpecChange = (event) => {
    const spec = Charts.vegaEditorDataUrlToSpec(event.target.value) || event.target.value;
    this.setState({ spec });
  };

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
  };

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
  };

  openInVegaEditor = () => {
    const url = Charts.vegaEditorSpecToDataUrl(this.state.spec || this.generateDefaultSpec());
    Downloads.openUrl(url);
  };

  renderControls() {
    const { props } = this;

    const isStandardChartType = (
      props.chartType
      &&
      props.chartType !== "custom"
    );

    if (props.chartType === "custom") {
      return (
        <UiControlsMenu
          className="mr-chart-spec-menu"
          onClear={(props.spec) && (() => props.onSpecChange(null))}
          onClose={this.saveSpecChanges}
          onOpen={() => this.setState({ spec: props.spec || "" })}
          ref={this.vegaSpecMenu}
          title="Vega Spec"
        >
          {/*
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
          */}

          <textarea
            value={this.state.spec}
            onChange={this.handleSpecChange}
            placeholder="Enter Vega or Vega-Lite sepc"
          />
        </UiControlsMenu>
      );
    }

    if (props.chartType === "heatmap") {
      return (
        <UiControlsMenu
          title="Columns"
        >
          <MultipleDataColumnsSelect
            dataColumns={props.fullDatasetColumns.filter((x) => x !== props.idDataColumn)}
            // maxHeightOffset="400px"
            onChange={props.onColumnsChange}
            value={props.columns}
          />
        </UiControlsMenu>
      );
    }

    if (isStandardChartType) {
      const hasAxis = (props.chartType !== "piechart");

      const controls = [];

      if (hasAxis) {
        controls.push(
          <MainAxisMenu
            key="facet-menu"
            axisField={props.facetField}
            axisOrder={props.facetOrder}
            fullDatasetColumns={props.fullDatasetColumns}
            hideAxisType
            onAxisFieldChange={(field) => props.onFacetFieldChange(field)}
            onAxisOrderChange={props.onFacetOrderChange}
            onAxisReset={props.facetField && props.onFacetFieldChange}
            title="Facet"
          >
            <UiSelect
              label="Number of columns"
              onChange={props.onFacetGridColumnsChange}
              options={gridOptions}
              value={props.facetGridColumns}
            />
            <UiSelect
              label="Number of rows"
              onChange={props.onFacetGridRowsChange}
              options={gridOptions}
              value={props.facetGridRows}
            />
          </MainAxisMenu>
        );
      }

      controls.push(
        <MainAxisMenu
          key="series-menu"
          axisField={props.seriesDataColumn?.name}
          axisOrder={props.seriesOrder}
          axisType={props.seriesType}
          fullDatasetColumns={props.fullDatasetColumns}
          onAxisFieldChange={(field) => props.onSeriesFieldChange(field)}
          onAxisOrderChange={props.onSeriesOrderChange}
          onAxisReset={props.seriesField && props.onSeriesFieldChange}
          onAxisTypeChange={props.onSeriesTypeChange}
          title="Colour"
        >
          <UiSelect
            label="Stacking"
            value={props.seriesStacking ?? "stacked"}
            onChange={props.onSeriesStackingChange}
            options={stackingTypes}
          />
        </MainAxisMenu>
      );

      if (hasAxis) {
        if (
          isStandardChartType
            &&
            (!props.mainAxisEncoding || props.mainAxisEncoding === "y")
        ) {
          controls.push(
            <MainAxisMenu
              key="y-axis-main-menu"
              axisField={props.yAxisField}
              axisLabelAngle={props.yAxisLabelAngle ?? 0}
              axisLabelLimit={props.yAxisLabelLimit}
              axisMaxBins={props.chartType === "bar" && props.yAxisAutoType === "quantitative" ? (props.yAxisBins ?? 0) : undefined}
              axisOrder={props.yAxisOrder}
              axisType={props.yAxisType}
              fullDatasetColumns={props.fullDatasetColumns}
              onAxisFieldChange={(field) => props.onMainAxisFieldChange("yAxisField", field)}
              onAxisLabelAngleChange={props.onYAxisLabelAngleChange}
              onAxisLabelLimitChange={props.onYAxisLabelLimitChange}
              onAxisMaxBinsChange={props.onYAxisBinsChange}
              onAxisOrderChange={props.onYAxisOrderChange}
              onAxisReset={() => props.onMainAxisFieldChange("yAxisField")}
              onAxisTypeChange={props.onYAxisTypeChange}
              ref={this.yAxisMenu}
              title="Y Axis"
            />
          );
        }
        else {
          controls.push(
            <SecondaryAxisMenu
              key="y-axis-secondary-menu"
              axisField={props.yAxisField}
              axisLabelLimit={props.yAxisLabelLimit}
              axisMode={props.yAxisMode}
              fullDatasetColumns={props.fullDatasetColumns}
              onAxisFieldChange={(field) => props.onYAxisFieldChange(field)}
              onAxisLabelLimitChange={props.onYAxisLabelLimitChange}
              onAxisModeChange={props.onYAxisModeChange}
              onAxisReset={() => props.onMainAxisFieldChange("yAxisField")}
              ref={this.yAxisMenu}
              title="Y Axis"
            />
          );
        }

        if (
          isStandardChartType
          &&
          (!props.mainAxisEncoding || props.mainAxisEncoding === "x")
        ) {
          controls.push(
            <MainAxisMenu
              key="x-axis-main-menu"
              axisField={props.xAxisField}
              axisLabelAngle={props.xAxisLabelAngle ?? -90}
              axisLabelLimit={props.xAxisLabelLimit}
              axisMaxBins={props.chartType === "bar" && props.xAxisAutoType === "quantitative" ? (props.xAxisBins ?? 0) : undefined}
              axisOrder={props.xAxisOrder}
              axisType={props.xAxisType}
              fullDatasetColumns={props.fullDatasetColumns}
              onAxisFieldChange={(field) => props.onMainAxisFieldChange("xAxisField", field)}
              onAxisLabelAngleChange={props.onXAxisLabelAngleChange}
              onAxisLabelLimitChange={props.onXAxisLabelLimitChange}
              onAxisMaxBinsChange={props.onXAxisBinsChange}
              onAxisOrderChange={props.onXAxisOrderChange}
              onAxisReset={() => props.onMainAxisFieldChange("xAxisField")}
              onAxisTypeChange={props.onXAxisTypeChange}
              ref={this.xAxisMenu}
              title="X Axis"
            />
          );
        }
        else {
          controls.push(
            <SecondaryAxisMenu
              key="x-axis-secondary-menu"
              axisField={props.xAxisField}
              axisLabelLimit={props.xAxisLabelLimit}
              axisMode={props.xAxisMode}
              fullDatasetColumns={props.fullDatasetColumns}
              onAxisFieldChange={(field) => props.onXAxisFieldChange(field)}
              onAxisLabelLimitChange={props.onXAxisLabelLimitChange}
              onAxisModeChange={props.onXAxisModeChange}
              onAxisReset={() => props.onMainAxisFieldChange("xAxisField")}
              ref={this.xAxisMenu}
              title="X Axis"
            />
          );
        }
      }

      return controls;
    }

    return null;
  }

  render() {
    const { props } = this;

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
        <UiAnimation in={props.controls}>

          { this.renderControls() }

          <UiControlsMenu
            title="Chart Type"
            hideOnClick
            onClear={props.chartType && (() => props.onChartTypeChange())}
            ref={this.chartTypeMenu}
          >
            <UiRadioList
              items={chartTypeOptions}
              onChange={
                (value) => {
                  props.onChartTypeChange(value);
                  if (value) {
                    setTimeout(
                      () => {
                        if (value === "custom") {
                          this.chartTypeMenu.current?.close();
                          this.vegaSpecMenu.current?.open();
                        }
                        else if (!props.xAxisField && !props.yAxisField) {
                          this.chartTypeMenu.current?.close();
                          this.xAxisMenu.current?.open();
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

        </UiAnimation>
      </div>
    );
  }

}

ChartControls.propTypes = {
  chartType: ChartTypes,
  columns: PropTypes.arrayOf(PropTypes.string),
  controls: PropTypes.bool.isRequired,
  dataFileUrl: PropTypes.string,
  facetField: PropTypes.string,
  facetGridColumns: PropTypes.number,
  facetGridRows: PropTypes.number,
  facetOrder: PropTypes.string,
  fullDatasetColumns: PropTypes.arrayOf(DataColumn).isRequired,
  interpolateType: PropTypes.string.isRequired,
  mainAxisEncoding: PropTypes.oneOf([ "x", "y" ]),
  onChartTypeChange: PropTypes.func.isRequired,
  onColumnsChange: PropTypes.func.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onDownloadPNG: PropTypes.func.isRequired,
  onDownloadSVG: PropTypes.func.isRequired,
  onFacetFieldChange: PropTypes.func.isRequired,
  onFacetGridColumnsChange: PropTypes.func.isRequired,
  onFacetGridRowsChange: PropTypes.func.isRequired,
  onFacetOrderChange: PropTypes.func.isRequired,
  onInterpolateChange: PropTypes.func.isRequired,
  onMainAxisFieldChange: PropTypes.func.isRequired,
  onSeriesFieldChange: PropTypes.func.isRequired,
  onSeriesOrderChange: PropTypes.func.isRequired,
  onSeriesStackingChange: PropTypes.func.isRequired,
  onSeriesTypeChange: PropTypes.func.isRequired,
  onShowSelecttionChange: PropTypes.func.isRequired,
  onSpecChange: PropTypes.func.isRequired,
  onXAxisBinsChange: PropTypes.func.isRequired,
  onXAxisFieldChange: PropTypes.func.isRequired,
  onXAxisLabelAngleChange: PropTypes.func.isRequired,
  onXAxisLabelLimitChange: PropTypes.func.isRequired,
  onXAxisModeChange: PropTypes.func.isRequired,
  onXAxisOrderChange: PropTypes.func.isRequired,
  onXAxisTypeChange: PropTypes.func.isRequired,
  onYAxisBinsChange: PropTypes.func.isRequired,
  onYAxisFieldChange: PropTypes.func.isRequired,
  onYAxisLabelAngleChange: PropTypes.func.isRequired,
  onYAxisLabelLimitChange: PropTypes.func.isRequired,
  onYAxisModeChange: PropTypes.func.isRequired,
  onYAxisOrderChange: PropTypes.func.isRequired,
  onYAxisTypeChange: PropTypes.func.isRequired,
  seriesDataColumn: DataColumn,
  seriesField: PropTypes.string,
  seriesOrder: PropTypes.string,
  seriesStacking: PropTypes.string,
  seriesType: PropTypes.string,
  spec: PropTypes.string,
  xAxisAutoType: PropTypes.string,
  xAxisBins: PropTypes.number,
  xAxisField: PropTypes.string,
  xAxisLabelAngle: PropTypes.number,
  xAxisLabelLimit: PropTypes.number,
  xAxisMode: ChartAxisMode,
  xAxisOrder: PropTypes.string,
  xAxisType: PropTypes.string,
  yAxisAutoType: PropTypes.string,
  yAxisBins: PropTypes.number,
  yAxisField: PropTypes.string,
  yAxisLabelAngle: PropTypes.number,
  yAxisLabelLimit: PropTypes.number,
  yAxisMode: ChartAxisMode,
  yAxisOrder: PropTypes.string,
  yAxisType: PropTypes.string,
};

//#endregion
