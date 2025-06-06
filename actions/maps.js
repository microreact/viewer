import geojsonLayerDataSelector from "../selectors/maps/geojson-layer-data";
import mapStateSelector from "../selectors/maps/map-state";
import rowsByRegionSelector from "../selectors/maps/rows-by-region";
import { getPresentState } from "../utils/state";
import { selectRows, toggleFieldFilter } from "./filters";

export function addGeoData(mapId, fileId, options = {}) {
  return {
    delay: true,
    label: "Map: Add geographical features",
    mapId,
    payload: {
      file: fileId,
      linkType: options.linkType || "geographic-coordinates",
      linkFieldName: options.linkFieldName,
      linkPropertyName: options.linkPropertyName,
    },
    type: "MICROREACT VIEWER/ADD GEO DATA",
  };
}

export function addGeographicCoordinatesMap(title, latitudeField, longitudeField, unit) {
  return {
    delay: true,
    label: "Map: Add geographical map",
    payload: {
      title,
      dataType: "geographic-coordinates",
      coordinateUnit: unit || "decimal-degrees",
      latitudeField,
      longitudeField,
    },
    type: "MICROREACT VIEWER/ADD MAP",
  };
}

export function addMap(paneId, title) {
  return {
    payload: {
      paneId,
      title: title || "Map",
    },
    type: "MICROREACT VIEWER/ADD MAP",
  };
}

export function removeMap(paneId) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const mapState = mapStateSelector(state, paneId);
    dispatch({
      delay: true,
      group: `${paneId}/remove`,
      label: "Map: Remove Map",
      payload: {
        paneId,
        fileId: mapState?.geodata?.file,
      },
      type: "MICROREACT VIEWER/REMOVE MAP",
    });
  };
}

export function selectRegion(mapId, regionId, merge) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const mapState = mapStateSelector(state, mapId);
    const geodata = mapState.geodata;
    if (mapState.filterMap && geodata.linkType === "field-property" && geodata.linkField && geodata.linkPropertyName) {
      const geojson = geojsonLayerDataSelector(state, mapId);
      for (const feature of geojson.features) {
        if (feature.properties["mr-region-id"] === regionId) {
          dispatch(
            toggleFieldFilter(
              geodata.linkField,
              "in",
              [ feature.properties[geodata.linkPropertyName] ],
            )
          );
        }
      }
    }
    else {
      const rowsByRegion = rowsByRegionSelector(state, mapId);
      dispatch(
        selectRows(
          rowsByRegion[regionId].map((x) => x[0]),
          merge,
        )
      );
    }
  };
}

export function setFilter(mapId, path = null) {
  return {
    delay: true,
    group: `${mapId}/filter`,
    label: "Map: Set map filter",
    mapId,
    payload: path,
    type: "MICROREACT VIEWER/SET MAP FILTER",
  };
}

export function setLasso(mapId, isLassoActive) {
  return {
    delay: true,
    group: `${mapId}/lasso`,
    label: "Map: Toggle lasso",
    mapId,
    payload: isLassoActive,
    type: "MICROREACT VIEWER/SET MAP LASSO",
  };
}

export function setTrackViewport(mapId, isActive) {
  return {
    delay: true,
    group: `${mapId}/trackViewport`,
    label: "Map: Toggle filter on current viewport",
    mapId,
    payload: isActive,
    type: "MICROREACT VIEWER/SET MAP TRACK VIEWPORT",
  };
}

export function setViewport(mapId, viewport) {
  return {
    group: `${mapId}/viewport`,
    label: "Map: Pan/zoom map",
    mapId,
    payload: viewport,
    savable: false,
    type: "MICROREACT VIEWER/SET MAP VIEWPORT",
  };
}

export function update(mapId, key, value) {
  return {
    delay: true,
    group: `${mapId}/${key}`,
    label:
      (key === "nodeSize") ? `Map: Set marker size ${value}` :
        (key === "regionsColourField") ? `Map: Set regions colour by column to ${value}` :
          (key === "regionsColourMethod") ? `Map: Set regions colour method to ${value}` :
            (key === "regionsColourPalette") ? `Map: Set regions colour palaette to ${value}` :
              (key === "style") ? `Map: Set map style to ${value}` :
                (key === "scaleMarkers") ? "Map: Toggle scale markers" :
                  (key === "showMarkers") ? "Map: Toggle show markers" :
                    (key === "showRegions") ? "Map: Toggle show regions" :
                      (key === "showRegionOutlines") ? "Map: Toggle region borders" :
                        (key === "regionsColourOpacity") ? `Map: Set regions colour opacity to ${value}` :
                          undefined,
    mapId,
    payload: { [key]: value },
    type: "MICROREACT VIEWER/UPDATE MAP",
  };
}
