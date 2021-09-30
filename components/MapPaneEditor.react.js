import PropTypes from "prop-types";
import React from "react";
import Box from "@material-ui/core/Box";

import UiSelect from "./UiSelect.react";
import UiCombobox from "./UiCombobox.react";
import FileEditor from "../containers/FileEditor.react";

import { DataColumn } from "../utils/prop-types";
import { halfWidthWithPaddingStyle } from "../constants";

function MapPaneEditor(props) {
  const mapState = props.mapState;
  return (
    <React.Fragment>
      <UiSelect
        label="Map Type"
        variant="outlined"
        size="small"
        value={mapState.dataType}
        onChange={(value) => props.onMapPropChange("dataType", value)}
        options={
          [
            {
              label: "Geographic Coordinates",
              secondary: "Metadata includes latitude and longitude columns",
              value: "geographic-coordinates",
            },
            {
              label: "ISO 3166 Codes",
              secondary: "Metadata include a column for ISO 3166-1 or 3166-2 codes",
              value: "iso-3166-codes",
            },
          ]
        }
      />

      {
        (mapState.dataType === "geographic-coordinates") && (
          <React.Fragment>
            <Box display="flex" justifyContent="space-between">
              <Box style={halfWidthWithPaddingStyle}>
                <UiCombobox
                  label="Latitude Column"
                  options={props.dataFields.filter((x) => x.isNumeric)}
                  onChange={(value) => props.onMapPropChange("latitudeField", value.name)}
                  value={mapState.latitudeField}
                />
              </Box>
              <Box style={halfWidthWithPaddingStyle}>
                <UiCombobox
                  label="Longitude Column"
                  options={props.dataFields.filter((x) => x.isNumeric)}
                  onChange={(value) => props.onMapPropChange("longitudeField", value.name)}
                  value={mapState.longitudeField}
                />
              </Box>
            </Box>

            {/*
            <UiSelect
              label="Coordinate Unit"
              variant="outlined"
              size="small"
              value={mapState.coordinateUnit}
              onChange={(value) => props.onMapPropChange("coordinateUnit", value)}
              options={
                [
                  {
                    label: "Decimal Degrees",
                    secondary: "51.507353, -0.127758 for London.",
                    value: "decimal-degrees",
                  },
                  {
                    label: "Degrees, Minutes, and Seconds (DMS)",
                    secondary: "51°30'26.5\"N 0°07'39.9\"W for London.",
                    value: "degrees-minutes-seconds",
                  },
                ]
              }
            />
            */}
          </React.Fragment>
        )
      }

      {
        (mapState.dataType === "iso-3166-codes") && (
          <React.Fragment>
            <UiCombobox
              label="ISO 3166 Column"
              options={props.dataFields.filter((x) => x.dataType === "text")}
              onChange={(value) => props.onMapPropChange("iso3166Field", value.name)}
              value={mapState.iso3166Field}
            />

            <UiSelect
              label="Principal Subdivisions"
              variant="outlined"
              size="small"
              value={mapState.iso3166Subdivisions}
              onChange={(value) => props.onMapPropChange("iso3166Subdivisions", value)}
              options={
                [
                  {
                    label: "Include Subdivisions",
                    secondary: "Use both ISO 3166-1 and 3166-2 codes",
                    value: true,
                  },
                  {
                    label: "Ignore Subdivisions",
                    secondary: "ISO 3166-2 codes will be replaced by 3166-1 codes (e.g. GB-CAM becomes GB)",
                    value: false,
                  },
                ]
              }
            />
          </React.Fragment>
        )
      }

      <hr />

      <FileEditor
        fileId={mapState?.geodata?.file}
        label="GeoJSON File"
        paneId={props.mapId}
      />

    </React.Fragment>
  );
}

MapPaneEditor.displayName = "MapPaneEditor";

MapPaneEditor.propTypes = {
  dataFields: PropTypes.arrayOf(DataColumn).isRequired,
  mapId: PropTypes.string.isRequired,
  mapState: PropTypes.object.isRequired,
  onMapPropChange: PropTypes.func.isRequired,
};

export default MapPaneEditor;
