import PropTypes from "prop-types";
import React from "react";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import CropFreeOutlinedIcon from "@material-ui/icons/CropFreeOutlined";
import Box from "@material-ui/core/Box";

import "../css/map-controls.css";
import Animation from "./Animation.react";
import UiControlsMenu from "./UiControlsMenu.react";
import LassoButton from "./LassoButton.react";
import UiToggleSwitch from "./UiToggleSwitch.react";
import UiToggleSlider from "./UiToggleSlider.react";
import UiRadioList from "./UiRadioList.react";
import GradientColourPalettePicker from "./GradientColourPalettePicker.react";
import { DataColumn, StylePalette } from "../utils/prop-types";
import UiTabs from "./UiTabs.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiControlsButton from "./UiControlsButton.react";
import UiSlider from "./UiSlider.react";
import UiToggleButtons from "./UiToggleButtons.react";

const mapStyles = [
  { value: "microreact", label: "Microreact" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "streets", label: "Streets" },
  { value: "satellite", label: "Satellite" },
  { value: "basic", label: "Basic" },
  { value: "bright", label: "Bright" },
];

const colourMethods = [
  { value: "sum", label: "Sum", type: "continuous" },
  { value: "mean", label: "Mean", type: "continuous" },
  { value: "median", label: "Median", type: "continuous" },
  { value: "mode", label: "Mode", type: "continuous" },
  { value: "min", label: "Min", type: "continuous" },
  { value: "max", label: "Max", type: "continuous" },
  { value: "first", label: "First", type: "discrete" },
  { value: "last", label: "Last", type: "discrete" },
  { value: "mode", label: "Most frequent value", type: "discrete" },
  { value: "unique", label: "Number of unique values", type: "discrete" },
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
                  onClick={props.onEditPane}
                >
                  Edit Map
                </UiDropdownMenu.Item>

                <Divider />
              </React.Fragment>
            )
          }

          <UiDropdownMenu.Item
            key="png"
            onClick={props.onDownloadPNG}
          >
            Download as PNG image
          </UiDropdownMenu.Item>
        </UiDropdownMenu>

        <UiControlsButton
          active={props.controls}
          onClick={() => props.onControlsChange(!props.controls)}
        />

        <Animation in={props.controls}>

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
                className="map-regions"
                title="Regions"
              >
                <UiToggleSwitch
                  label="Show regions"
                  onChange={props.onShowRegionsChange}
                  value={props.showRegions}
                />

                {
                  props.showRegions && (
                    <UiToggleSwitch
                      label="Outline regions"
                      onChange={props.onShowRegionOutlinesChange}
                      value={props.showRegionOutlines}
                    />
                  )
                }

                {
                  props.showRegions && (
                    <UiSlider
                      label="Fill colour opacity"
                      max={100}
                      min={0}
                      onChange={(value) => props.onRegionsColourOpacityChange(value)}
                      unit="%"
                      value={props.regionsColourOpacity}
                    />
                  )
                }

                {
                  props.showRegions && (
                    <UiTabs>
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
                    </UiTabs>
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
                  <small value="square">sqrt</small>
                  <small value="logarithmic">log</small>
                  <small value="linear">linear</small>
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
        </Animation>
      </div>
    );
  }
);

MapControls.displayName = "MapControls";

MapControls.propTypes = {
  colourPalettes: PropTypes.arrayOf(StylePalette),
  controls: PropTypes.bool.isRequired,
  dataFields: PropTypes.arrayOf(DataColumn).isRequired,
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
  regionsColourMethodType: PropTypes.oneOf([
    "continuous",
    "discrete",
  ]),
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
