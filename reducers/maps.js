import { emptyObject } from "../constants";
import { mapQueryToProps } from "../utils/query";
import {
  updateAll as updateAllMaps,
  updateKeyedState as updateMap,
  newId,
  removeKeyedState,
} from "../utils/state";

const initialState = {
  bounds: undefined,
  centre: undefined,
  controls: false,
  dataType: "geographic-coordinates",
  grouped: true,
  groupMarkersByRegion: false,
  lasso: false,
  markersOpacity: 100,
  maxNodeSize: 64,
  minNodeSize: 4,
  nodeSize: 14,
  path: null,
  regionsColourField: null,
  regionsColourOpacity: 100,
  regionsColourPalette: "ColorBrewer YlOrBr-2",
  scaleMarkers: false,
  scaleType: "logarithmic",
  showMarkers: true,
  showRegionOutlines: true,
  showRegions: true,
  source: undefined,
  style: "",
  tileLayerDialog: false,
  tileLayerOpts: null,
  tileLayerUrl: null,
  trackViewport: false,
  type: "mapbox",
};

const queryPropMap = {
  centre: { key: "mo", type: Array },
  controls: { key: "mc", type: Boolean },
  maxNodeSize: { key: "mxns", type: Number },
  minNodeSize: { key: "mmns", type: Number },
  nodeSize: { key: "mns", type: Number },
  minMarkerSize: { key: "mmnr", type: Number },
  maxMarkerSize: { key: "mxnr", type: Number },
  scaleMarkers: { key: "msm", type: Boolean },
  style: { key: "ms" },
  tileLayerOpts: { key: "mto" },
  tileLayerUrl: { key: "mtu" },
  // zoom: { key: "mz", type: Number },
  scaleType: {
    key: "mst",
    values: {
      square: "s",
      quadratic: "q",
      logarithmic: "g",
      linear: "l",
    },
  },
};

export default function (state = {}, action) {
  switch (action.type) {
    case "MICROREACT VIEWER/ADD GEO DATA": {
      const mapId = action.mapId || Object.keys(state)[0] || "map-1";
      return updateMap(
        state,
        mapId,
        {
          ...((mapId in state) ? emptyObject : initialState),
          title: state[mapId]?.title ?? "Map",
          geodata: {
            file: action.payload.file,
            linkType: action.payload.linkType,
            linkField: action.payload.linkFieldName,
            linkProperty: action.payload.linkPropertyName,
          },
        },
      );
    }

    case "MICROREACT VIEWER/ADD MAP": {
      return {
        ...state,
        [newId(state, "map")]: {
          ...initialState,
          title: action.payload.title,
          ...action.payload,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const maps = {};
      for (const mapId of Object.keys(action.payload.maps)) {
        maps[mapId] = {
          ...initialState,
          ...action.payload.maps[mapId],
          // bounds: (action.payload.settings.map_bounds && action.payload.settings.map_bounds.length ? action.payload.settings.map_bounds : undefined) || state.bounds,
          // style: action.payload.settings.map_style || state.style,
          // source: action.payload.settings.map_source || state.source,
          // type: action.payload.settings.map_type || state.type,
          // ...(action.payload.savedState.map || {}),
          ...mapQueryToProps(queryPropMap, action.payload.query),
        };
      }
      return maps;
    }

    case "MICROREACT VIEWER/RESET ALL FILTERS":
    case "MICROREACT VIEWER/RESET MAP FILTERS": {
      return updateAllMaps(
        state,
        { path: null },
      );
    }

    case "MICROREACT VIEWER/QUERY": {
      const queryState = mapQueryToProps(queryPropMap, action.payload);
      if (Object.keys(queryState)) {
        return updateAllMaps(
          state,
          queryState,
        );
      }
      else {
        return state;
      }
    }

    case "MICROREACT VIEWER/REMOVE FILE": {
      for (const mapId of Object.keys(state)) {
        if (state[mapId]?.geodata?.file === action.payload) {
          return updateMap(
            state,
            mapId,
            { geodata: undefined },
          );
        }
      }
      return state;
    }

    case "MICROREACT VIEWER/REMOVE MAP": {
      return removeKeyedState(
        state,
        action.payload.paneId,
      );
    }

    case "MICROREACT VIEWER/SET MAP FILTER": {
      return updateMap(
        state,
        action.mapId,
        { path: action.payload || null }
      );
    }

    case "MICROREACT VIEWER/SET MAP LASSO": {
      return updateMap(
        state,
        action.mapId,
        {
          lasso: action.payload,
          path: null,
          trackViewport: false,
        },
      );
    }

    case "MICROREACT VIEWER/SET MAP TRACK VIEWPORT": {
      return updateMap(
        state,
        action.mapId,
        {
          trackViewport: action.payload,
          path: null,
          lasso: false,
        },
      );
    }

    case "MICROREACT VIEWER/SET MAP VIEWPORT": {
      return updateMap(
        state,
        action.mapId,
        { viewport: action.payload },
      );
    }

    case "MICROREACT VIEWER/UPDATE MAP": {
      // mapPropsToQuery(queryPropMap, action.payload);
      return updateMap(
        state,
        action.mapId,
        action.payload,
      );
    }

    // case "HISTORY REVERT": {
    //   return action.payload.state.map;
    // }

    default:
      return state;
  }
};
