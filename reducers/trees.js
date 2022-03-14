import { mapQueryToProps } from "../utils/query";
import {
  newId,
  removeKeyedState,
  updateAll as updateAllTrees,
  updateKeyedState as updateTree,
} from "../utils/state";

const initialState = {
  lasso: false,
  path: null,
  subtreeIds: null,
  alignLabels: true,
  blockHeaderFontSize: 13,
  blockSize: 14,
  blockPadding: 0,
  blocks: [],
  controls: false,
  fontSize: 16,
  ids: null,
  nodeSize: 14,
  showBlockHeaders: true,
  showBlockLabels: false,
  showBranchLengths: false,
  showEdges: true,
  showInternalLabels: false,
  showLabels: true,
  showLeafLabels: false,
  showPiecharts: true,
  showShapeBorders: true,
  showShapes: true,
  scaleLineAlpha: true,
  styleLeafLabels: false,
  styleNodeEdges: false,
  type: "rc",
  hideOrphanDataRows: false,
};

const queryPropMap = {
  controls: { key: "tc", type: Boolean },
  blockSize: { key: "tbl", type: Number },
  fontSize: { key: "tts", type: Number },
  minBlockSize: { key: "tnbl", type: Number },
  maxBlockSize: { key: "txbl", type: Number },
  minFontSize: { key: "tnts", type: Number },
  maxFontSize: { key: "txts", type: Number },
  minNodeSize: { key: "tmns", type: Number },
  maxNodeSize: { key: "txns", type: Number },
  nodeSize: { key: "tns", type: Number },
  showLabels: { key: "tl", type: Boolean },
  type: { key: "tt" },
};

export default function (state = {}, action) {
  switch (action.type) {
    case "MICROREACT VIEWER/ADD TREE": {
      const treeId = action.payload.paneId || newId(state, "tree");
      return {
        ...state,
        [treeId]: {
          ...initialState,
          title: action.payload.title || "Tree",
          labelField: action.payload.labelFieldName,
          file: action.payload.file,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const nextState = {};
      const queryProps = mapQueryToProps(queryPropMap, action.payload.query);
      for (const treeId of Object.keys(action.payload.trees)) {
        nextState[treeId] = {
          ...initialState,
          ...action.payload.trees[treeId],
          ...queryProps,
        };
      }
      return nextState;
    }

    case "MICROREACT VIEWER/QUERY": {
      const queryState = mapQueryToProps(queryPropMap, action.payload);
      if (Object.keys(queryState)) {
        return updateAllTrees(
          state,
          queryState,
        );
      }
      else {
        return state;
      }
    }

    case "MICROREACT VIEWER/REMOVE FILE": {
      for (const treeId of Object.keys(state)) {
        if (state[treeId].file === action.payload) {
          const nextState = removeKeyedState(state, treeId);
          nextState[treeId] = initialState;
          return nextState;
        }
      }
      return state;
    }

    case "MICROREACT VIEWER/REMOVE TREE": {
      return removeKeyedState(
        state,
        action.payload.paneId,
      );
    }

    case "MICROREACT VIEWER/RESET ALL FILTERS":
    case "MICROREACT VIEWER/RESET TREE FILTERS": {
      return updateAllTrees(
        state,
        {
          ids: null,
          path: null,
        }
      );
    }

    // case "MICROREACT VIEWER/REVERT HISTORY": {
    //   return {
    //     ...action.payload.state.tree,
    //     phylocanvas: {
    //       ...action.payload.state.tree.phylocanvas,
    //       contextMenu: {
    //         ...action.payload.state.tree.phylocanvas.contextMenu,
    //         open: false,
    //       },
    //     },
    //   };
    // }

    case "MICROREACT VIEWER/SET PHYLOCANVAS PROPS": {
      const treeState = state[action.treeId];
      let ids = treeState.ids;
      let subtreeIds = treeState.subtreeIds;
      let path = treeState.path;
      let lasso = treeState.lasso;

      if (action.payload.rootId && action.payload.rootId !== treeState.rootId) {
        subtreeIds = action.payload.ids;
        ids = null;
      }
      else if (Array.isArray(action.payload.ids)) {
        ids = action.payload.ids;
      }

      if (action.payload.rootId === null && treeState.rootId) {
        ids = null;
        subtreeIds = null;
      }

      if (action.payload.type && action.payload.type !== treeState.type) {
        path = null;
        lasso = false;
      }

      const {
        // The following properties are computed and supplied via
        // phylocanvasPropsSelector so we can keep them out of the store
        fontFamily, id, interactive, labelField, log, metadata, padding, partialRender, selectedIds, showLabels, size, strokeColour, styles, // eslint-disable-line no-unused-vars
        ...phylocanvasStateUpdate
      } = action.payload;

      const updater = {
        ids,
        subtreeIds,
        path,
        lasso,
        ...phylocanvasStateUpdate,
      };
      return updateTree(
        state,
        action.treeId,
        updater
      );
    }

    case "MICROREACT VIEWER/SET TREE FILTER": {
      const treeState = state[action.treeId];
      return updateTree(
        state,
        action.treeId,
        {
          ids: action.payload.ids || null,
          path: (action.payload !== undefined) ? action.payload.path : treeState.path,
        }
      );
    }

    case "MICROREACT VIEWER/SET TREE LASSO": {
      const treeState = state[action.treeId];
      return updateTree(
        state,
        action.treeId,
        {
          lasso: action.payload,
          ids: (action.payload === false) ? null : treeState.ids,
          path: (action.payload === false) ? null : treeState.path,
        }
      );
    }

    case "MICROREACT VIEWER/UPDATE TREE": {
      return updateTree(
        state,
        action.treeId,
        { [action.payload.key]: action.payload.value }
      );
    }

    default:
      return state;
  }
}
