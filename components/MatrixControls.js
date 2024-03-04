import PropTypes from "prop-types";
import React from "react";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import UiAnimation from "./UiAnimation.react";
import UiControlsButton from "./UiControlsButton.react";
import UiControlsMenu from "./UiControlsMenu.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiSlider from "./UiSlider.react";
import UiToggleSlider from "./UiToggleSlider.react";
import UiToggleSwitch from "./UiToggleSwitch.react";

const MatrixControls = React.memo(
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
                  Edit Matrix
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

          {/* <UiControlsButton
            active={props.trackViewport}
            onClick={() => props.onTrackViewportChange(!props.trackViewport)}
            title="Filter on current viewport"
          >
            <CropFreeOutlinedIcon />
          </UiControlsButton>

          <hr /> */}

          <UiControlsMenu
            className="mr-matrix-styles-menu"
            title="Labels"
          >
            <UiToggleSlider
              checked={props.showLabels}
              label="Show Values"
              max={props.maxFontSize}
              min={props.minFontSize}
              onChange={props.onLabelsFontSizeChange}
              onCheckedChange={props.onShowLabelsChange}
              unit="px"
              value={props.labelsFontSize}
            />

            {
              (props.showLabels) && (
                <UiToggleSwitch
                  label="Truncate values"
                  onChange={props.onTruncateLabelsChange}
                  value={props.truncateLabels}
                />
              )
            }

            <UiToggleSwitch
              label="Append unit"
              onChange={(value) => props.onLabelsUnitChange(value ? "" : undefined)}
              value={props.labelsUnit !== undefined}
            />

            {
              (props.labelsUnit !== undefined) && (
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="row"
                  style={{ width: 200 }}
                >
                  <TextField
                    label="Values unit"
                    onChange={(event) => props.onLabelsUnitChange(event.target.value)}
                    size="small"
                    value={props.labelsUnit}
                    variant="outlined"
                    style={{ width: "100%" }}
                  />
                </Box>
              )
            }

            <hr />

            <UiSlider
              label="Rotate axis labels"
              max={90}
              min={0}
              onChange={(value) => props.onRotateAxisLabelsChange(value)}
              unit={"\u{00B0}"}
              value={props.rotateAxisLabels}
              step={15}
            />

          </UiControlsMenu>

        </UiAnimation>
      </div>
    );
  }
);

MatrixControls.displayName = "MatrixControls";

MatrixControls.propTypes = {
  controls: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  labelsFontSize: PropTypes.number,
  labelsUnit: PropTypes.string,
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  onControlsChange: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onFontSizeChange: PropTypes.func.isRequired,
  onLabelsFontSizeChange: PropTypes.func.isRequired,
  onLabelsUnitChange: PropTypes.func.isRequired,
  onRotateAxisLabelsChange: PropTypes.func.isRequired,
  onShowLabelsChange: PropTypes.func.isRequired,
  onTruncateLabelsChange: PropTypes.func.isRequired,
  rotateAxisLabels: PropTypes.number,
  showLabels: PropTypes.bool,
  truncateLabels: PropTypes.bool,
};

export default MatrixControls;
