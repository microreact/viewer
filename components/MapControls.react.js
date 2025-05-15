import PropTypes from "prop-types";
import React from "react";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";
import Box from "@mui/material/Box";

// import "../styles/map-controls.css";

import { DataColumn, StylePalette } from "../utils/prop-types";

import DataColumnValuesCombobox from "../containers/DataColumnValuesCombobox.react";
import UiAnimation from "./UiAnimation.react";
import LassoButton from "./LassoButton.react";
import UiCombobox from "./UiCombobox.react";
import UiControlsButton from "./UiControlsButton.react";
import UiControlsMenu from "./UiControlsMenu.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiRadioList from "./UiRadioList.react";
import UiSelect from "./UiSelect.react";
import UiSlider from "./UiSlider.react";
import UiToggleButtons from "./UiToggleButtons.react";
import UiToggleSlider from "./UiToggleSlider.react";
import UiToggleSwitch from "./UiToggleSwitch.react";

const mapStyles = [
  // { value: "microreact", label: "Microreact" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "streets", label: "Streets" },
  { value: "satellite", label: "Satellite" },
  { value: "basic", label: "Basic" },
  { value: "bright", label: "Bright" },
];

const colourMethods = [
  { value: "entries", label: "Number of entries" },
  { value: "proportion", label: "Proportion of entries" },

  { value: "unique", label: "Number of unique values in a column" },
  { value: "value", label: "Number of specific values in a column" },

  // { value: "first", label: "First", type: "discrete" },
  // { value: "last", label: "Last", type: "discrete" },
  // { value: "frequent", label: "Most frequent value in a column", type: "discrete" },

  { value: "sum", label: "Sum of a numeric column", numeric: true },
  { value: "mean", label: "Mean of a numeric column", numeric: true },
  { value: "median", label: "Median of a numeric column", numeric: true },
  { value: "mode", label: "Mode of a numeric column", numeric: true },
  { value: "min", label: "Min of a numeric column", numeric: true },
  { value: "max", label: "Max of a numeric column", numeric: true },
];

const MapControls = React.memo(
  (props) => {
    return (
      <div
        className="mr-main-controls"
        data-html2canvas-ignore="true"
      >
        <UiDropdownMenu
          button={UiControlsButton}
          icon={<MenuIcon />}
        >
          {
            !props.isReadOnly && (
              <React.Fragment>
                <UiDropdownMenu.Item
                  className="mr-edit-map-menu__item mr-edit-map"
                  onClick={props.onEditPane}
                >
                  Edit Map
                </UiDropdownMenu.Item>

                <Divider className="mr-edit-map-menu__item mr-divider" />
              </React.Fragment>
            )
          }

          <UiDropdownMenu.Item
            onClick={props.onDownloadPNG}
          >
            Download as PNG image
          </UiDropdownMenu.Item>
        </UiDropdownMenu>

        <UiControlsButton
          active={props.controls}
          onClick={() => props.onControlsChange(!props.controls)}
        />

        <UiAnimation in={props.controls}>

          <LassoButton
            active={props.lasso}
            title={props.lasso ? "Disable map region filter" : "Activate map region filter"}
            onClick={() => props.onLassoChange(!props.lasso)}
          />

          <UiControlsButton
            active={props.trackViewport}
            onClick={() => props.onTrackViewportChange(!props.trackViewport)}
            title="Filter on current viewport"
          >
            <CropFreeOutlinedIcon />
          </UiControlsButton>

          <hr />

          <UiControlsMenu
            hideOnClick
            title="Style"
          >
            <UiRadioList
              items={mapStyles}
              onChange={props.onStyleChange}
              value={props.style}
            />
          </UiControlsMenu>

          {
            props.hasGeojsonData && (
              <UiControlsMenu
                className="mr-map-regions"
                title="Regions"
              >
                <UiToggleSwitch
                  label="Show GeoJSON features"
                  onChange={props.onShowRegionsChange}
                  value={props.showRegions}
                />

                {
                  props.showRegions && (
                    <React.Fragment>

                      <UiToggleSwitch
                        label="Region outlines"
                        onChange={props.onShowRegionOutlinesChange}
                        value={props.showRegionOutlines}
                      />

                      <UiSlider
                        label="Region opacity"
                        max={100}
                        min={0}
                        onChange={(value) => props.onRegionsColourOpacityChange(value)}
                        unit="%"
                        value={props.regionsColourOpacity}
                      />

                      {/* <UiToggleSlider
                        checked={props.regionsColourOpacity > 0}
                        onCheckedChange={(value) => props.onRegionsColourOpacityChange(value ? 100 : 0)}
                        label="Fill regions"
                        max={100}
                        min={0}
                        onChange={(value) => props.onRegionsColourOpacityChange(value)}
                        unit="%"
                        value={props.regionsColourOpacity}
                      /> */}

                      <UiSelect
                        label="Colour method"
                        onChange={props.onRegionsColourMethodChange}
                        options={colourMethods}
                        size="small"
                        value={props.regionsColourMethod}
                        variant="outlined"
                      />

                      {
                        (props.regionsColourMethod && props.regionsColourMethod !== "entries")
                        &&
                        (
                          <UiCombobox
                            label="Data Column"
                            onChange={(item) => props.onRegionsColourFieldChange(item.name)}
                            options={
                              colourMethods.find((x) => x.value === props.regionsColourMethod)?.numeric
                                ?
                                props.allDataColumns.filter((x) => x.isNumeric)
                                :
                                props.allDataColumns
                            }
                            value={props.regionsColourField}
                          />
                        )
                      }

                      {
                        (props.regionsColourMethod === "value" && props.regionsColourField)
                        &&
                        (
                          <DataColumnValuesCombobox
                            multiple
                            columnName={props.regionsColourField}
                            label="Values to count"
                            onChange={props.onRegionsColourValuesChange}
                            value={props.regionsColourValues ?? []}
                          />
                        )
                      }

                      {/* <UiTabs>
                      <div label="Colour by">
                        <UiRadioList
                          items={props.dataFields}
                          onChange={props.onRegionsColourFieldChange}
                          value={props.regionsColourField}
                          nullable
                          valueProperty="name"
                          nullOptionLabel="NUMBER OF ENTRIES"
                        />
                      </div>
                      {
                        !!props.regionsColourMethodType && (
                          <div label="Colour method">
                            <UiRadioList
                              items={colourMethods.filter((x) => x.type === props.regionsColourMethodType)}
                              onChange={props.onRegionsColourMethodChange}
                              value={props.regionsColourMethod}
                            />
                          </div>
                        )
                      }
                      <UiTabs.TabPanel label="Colour palette">
                        <Box
                          display="flex"
                          flexDirection="column"
                        >
                          <GradientColourPalettePicker
                            onChange={(item) => props.onRegionsColourPaletteChange(item.name)}
                            onlyContinuousPalettes
                            value={props.colourPalettes.find((x) => x.name === props.regionsColourPalette)}
                          />
                        </Box>
                      </UiTabs.TabPanel>
                    </UiTabs> */}

                    </React.Fragment>
                  )
                }
              </UiControlsMenu>
            )
          }

          <UiControlsMenu
            className="mr-map-markers-menu"
            title="Markers"
          >
            <UiToggleSlider
              checked={props.showMarkers}
              label="Map Markers"
              max={props.maxNodeSize}
              min={props.minNodeSize}
              onChange={props.onNodeSizeChange}
              onCheckedChange={props.onShowMarkersChange}
              unit="px"
              value={props.nodeSize}
            />

            {
              props.showMarkers && (
                <UiSlider
                  label="Marker opacity"
                  max={100}
                  min={0}
                  onChange={(value) => props.onMarkersOpacityChange(value)}
                  unit="%"
                  value={props.markersOpacity}
                />
              )
            }

            {
              props.showMarkers && props.hasGeojsonData && (
                <UiToggleSwitch
                  label="Group by region"
                  onChange={props.onGroupMarkersByRegionChange}
                  value={props.groupMarkersByRegion}
                />
              )
            }

            {
              props.showMarkers && (
                <UiToggleSwitch
                  label="Scale markers"
                  onChange={props.onScaleMarkersChange}
                  value={props.scaleMarkers}
                />
              )
            }

            {
              props.showMarkers && props.scaleMarkers && (
                <UiToggleButtons
                  label="Scaling function"
                  onChange={props.onScaleTypeChange}
                  value={props.scaleType}
                >
                  <small value="square">
                    sqrt
                  </small>
                  <small value="logarithmic">
                    log
                  </small>
                  <small value="linear">
                    linear
                  </small>
                  {/* <span value="quadratic">quadratic</span> */}
                </UiToggleButtons>
              )
            }

            {/*
            {
              props.showMarkers && props.scaleMarkers && (
                <UiSlider
                  label="Min marker size"
                  max={128}
                  min={1}
                  onChange={(value) => (value < props.maxScaledMarkerSize) && props.onMinMarkerSizeChange(value)}
                  unit="px"
                  value={props.minScaledMarkerSize}
                />
              )
            }
            */}

            {
              props.showMarkers && props.scaleMarkers && (
                <UiSlider
                  label="Max marker size"
                  max={128}
                  min={props.nodeSize}
                  onChange={(value) => props.onMaxMarkerSizeChange(value)}
                  unit="px"
                  value={props.maxScaledMarkerSize}
                />
              )
            }

          </UiControlsMenu>
        </UiAnimation>
      </div>
    );
  }
);

MapControls.displayName = "MapControls";

MapControls.propTypes = {
  allDataColumns: PropTypes.arrayOf(DataColumn).isRequired,
  colourPalettes: PropTypes.arrayOf(StylePalette),
  controls: PropTypes.bool.isRequired,
  groupMarkersByRegion: PropTypes.bool,
  hasGeojsonData: PropTypes.bool,
  isReadOnly: PropTypes.bool.isRequired,
  lasso: PropTypes.bool.isRequired,
  mapId: PropTypes.string,
  markersOpacity: PropTypes.number,
  maxNodeSize: PropTypes.number.isRequired,
  maxScaledMarkerSize: PropTypes.number,
  minNodeSize: PropTypes.number.isRequired,
  minScaledMarkerSize: PropTypes.number,
  nodeSize: PropTypes.number.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onDownloadPNG: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onGroupMarkersByRegionChange: PropTypes.func.isRequired,
  onLassoChange: PropTypes.func.isRequired,
  onMarkersOpacityChange: PropTypes.func.isRequired,
  onMaxMarkerSizeChange: PropTypes.func.isRequired,
  onMinMarkerSizeChange: PropTypes.func.isRequired,
  onNodeSizeChange: PropTypes.func.isRequired,
  onRegionsColourFieldChange: PropTypes.func.isRequired,
  onRegionsColourMethodChange: PropTypes.func.isRequired,
  onRegionsColourOpacityChange: PropTypes.func.isRequired,
  onRegionsColourPaletteChange: PropTypes.func.isRequired,
  onScaleMarkersChange: PropTypes.func.isRequired,
  onScaleTypeChange: PropTypes.func.isRequired,
  onShowMarkersChange: PropTypes.func.isRequired,
  onShowRegionOutlinesChange: PropTypes.func.isRequired,
  onShowRegionsChange: PropTypes.func.isRequired,
  onStyleChange: PropTypes.func.isRequired,
  onTrackViewportChange: PropTypes.func.isRequired,
  regionsColourField: PropTypes.string,
  regionsColourMethod: PropTypes.oneOf(colourMethods.map((x) => x.value)),
  regionsColourOpacity: PropTypes.number,
  regionsColourPalette: PropTypes.string,
  scaleMarkers: PropTypes.bool.isRequired,
  scaleType: PropTypes.string,
  showMarkers: PropTypes.bool,
  showRegionOutlines: PropTypes.bool,
  showRegions: PropTypes.bool,
  style: PropTypes.string,
  trackViewport: PropTypes.bool.isRequired,
  type: PropTypes.string,
};

export default MapControls;
