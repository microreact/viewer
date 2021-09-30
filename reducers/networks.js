import { mapQueryToProps } from "../utils/query";
import {
  newId,
  removeKeyedState,
  updateAll as updateAllNetworks,
  updateKeyedState as updateNetwork,
} from "../utils/state";

const initialState = {
  controls: false,
  edgeColourFilter: null,
  edgeLabelFilter: null,
  edgeLineStyleFilter: null,
  edgeLineWidthFilter: null,
  geographicLayout: false,
  labelSize: 16,
  lasso: false,
  layout: null,
  maxFontSize: 64,
  maxNodeSize: 64,
  minFontSize: 0,
  minNodeSize: 4,
  nodeSize: 14,
  path: null,
  randomSeed: 0,
  scale: 0,
  showLabels: true,
  showNodes: true,
};

const queryPropMap = {
  controls: { key: "nc", type: Boolean },
  fontSize: { key: "nts", type: Number },
  maxNodeSize: { key: "nxns", type: Number },
  minNodeSize: { key: "nmns", type: Number },
  nodeSize: { key: "nns", type: Number },
  showLabels: { key: "nl", type: Boolean },
  randomSeed: { key: "nrs", type: Number },
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case "MICROREACT VIEWER/ADD NETWORK": {
      const networkId = action.payload.paneId || newId(state, "network");
      return {
        ...state,
        [networkId]: {
          ...initialState,
          title: action.payload.title || "Network",
          nodeField: action.payload.nodeFieldName,
          file: action.payload.file,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const nextState = {};
      const queryProps = mapQueryToProps(queryPropMap, action.payload.query);
      for (const networkId of Object.keys(action.payload.networks)) {
        nextState[networkId] = {
          ...initialState,
          ...action.payload.networks[networkId],
          ...queryProps,
        };
      }
      return nextState;
    }

    case "MICROREACT VIEWER/QUERY": {
      const queryState = mapQueryToProps(queryPropMap, action.payload);
      if (Object.keys(queryState)) {
        return updateAllNetworks(
          state,
          queryState,
        );
      }
      else {
        return state;
      }
    }

    case "MICROREACT VIEWER/REMOVE FILE": {
      for (const networkId of Object.keys(state)) {
        if (state[networkId].file === action.payload) {
          const nextState = removeKeyedState(state, networkId);
          nextState[networkId] = initialState;
          return nextState;
        }
      }
      return state;
    }

    case "MICROREACT VIEWER/REMOVE NETWORK": {
      return removeKeyedState(
        state,
        action.payload.paneId,
      );
    }

    case "MICROREACT VIEWER/RESET ALL FILTERS":
    case "MICROREACT VIEWER/RESET NETWORK FILTERS": {
      return updateAllNetworks(
        state,
        { path: null },
      );
    }

    case "MICROREACT VIEWER/SET NETWORK FILTER": {
      const networkState = state[action.networkId];
      return updateNetwork(
        state,
        action.networkId,
        {
          path: (action.payload !== undefined) ? action.payload.path : networkState.path,
        },
      );
    }

    case "MICROREACT VIEWER/SET NETWORK LASSO": {
      const networkState = state[action.networkId];
      return updateNetwork(
        state,
        action.networkId,
        {
          lasso: action.payload,
          path: (action.payload === false) ? null : networkState.path,
        },
      );
    }

    case "MICROREACT VIEWER/SET NETWORK LAYOUT": {
      return updateNetwork(
        state,
        action.networkId,
        {
          path: null,
          layout: action.payload.layout,
        },
      );
    }

    case "MICROREACT VIEWER/UPDATE NETWORK": {
      return updateNetwork(
        state,
        action.networkId,
        action.payload,
      );
    }

    default:
      return state;
  }
};

export default reducer;
