/* eslint-disable indent */

import treeStateSelector from "../selectors/trees/tree-state";

import * as Arrays from "../utils/arrays";
import { getPresentState } from "../utils/state";

export function addTree(paneId, title, file, labelFieldName) {
  return {
    type: "MICROREACT VIEWER/ADD TREE",
    payload: {
      paneId,
      title: title || "Tree",
      file,
      labelFieldName,
    },
  };
}

export function removeTree(paneId) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const treeState = treeStateSelector(state, paneId);
    dispatch({
      delay: true,
      group: `${paneId}/remove`,
      label: "Tree: Remove Tree",
      payload: {
        paneId,
        fileId: treeState.file,
      },
      type: "MICROREACT VIEWER/REMOVE TREE",
    });
  };
}

export function setTreeFilter(treeId, ids, path) {
  return {
    delay: true,
    group: `${treeId}/filter`,
    label: "Tree: Change tree filter",
    payload: {
      ids,
      path,
    },
    treeId,
    type: "MICROREACT VIEWER/SET TREE FILTER",
  };
}

export function setTreeLasso(treeId, lasso) {
  return {
    delay: true,
    group: `${treeId}/lasso`,
    label: "Tree: Toggle tree lasso",
    payload: lasso,
    treeId,
    type: "MICROREACT VIEWER/SET TREE LASSO",
  };
}

export function setPhylocanvasProps(treeId, updater, origin) {
  return {
    delay: (origin !== "viewport" && origin !== "hover"),
    group: `${treeId}/${Object.keys(updater)}`,
    label:
      (origin === "viewport") ? "Tree: Pan/zoom tree" :
        undefined,
    payload: updater,
    treeId,
    savable: (origin !== "viewport" && origin !== "hover"),
    type: "MICROREACT VIEWER/SET PHYLOCANVAS PROPS",
  };
}

export function update(treeId, key, value) {
  return {
    delay: true,
    group: `${treeId}/${key}`,
    label:
      (key === "alignLabels") ? "Tree: Toggle align labels" :
      (key === "blockHeaderFontSize") ? `Tree: Set metadata header font size to ${value}` :
      (key === "blockSize") ? `Tree: Set metadata block size to ${value}` :
      (key === "blockPadding") ? `Tree: Set metadata block gap to ${value}` :
      (key === "blocks") ? `Tree: Set metadata columns to ${Arrays.summarise(value)}` :
      (key === "fontSize") ? `Tree: Set font size to ${value}` :
      (key === "nodeSize") ? `Tree: Set node size to ${value}` :
      (key === "showBlockHeaders") ? "Tree: Toggle metadata headers" :
      (key === "showBranchLengths") ? "Tree: Toggle branch lengths" :
      (key === "showLeafLabels") ? "Tree: Toggle leaf labels" :
      (key === "showPiecharts") ? "Tree: Toggle internal nodes" :
      (key === "showShapeBorders") ? "Tree: Toggle shape borders" :
      (key === "showShapes") ? "Tree: Toggle node shapes" :
      (key === "styleLeafLabels") ? "Tree: Toggle colour leaf labels" :
      (key === "styleLeafNodes") ? "Tree: Toggle colour leaf nodes" :
      (key === "styleNodeEdges") ? "Tree: Toggle colour internal edges" :
      (key === "styleNodeLines") ? "Tree: Toggle colour internal edges" :
        undefined,
    payload: {
      key,
      value,
    },
    treeId,
    type: "MICROREACT VIEWER/UPDATE TREE",
  };
}
