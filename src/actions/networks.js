import networkStateSelector from "../selectors/networks/network-state";
import { getPresentState } from "../utils/state";
import { downloadDataUrl } from "../utils/downloads";
import networkFileSelector from "../selectors/networks/network-file";

export function addNetwork(paneId, title, file, nodeFieldName) {
  return {
    type: "MICROREACT VIEWER/ADD NETWORK",
    payload: {
      paneId,
      title,
      file,
      nodeFieldName,
    },
  };
}

export function downloadFile(networkId) {
  return (_, getState) => {
    const state = getPresentState(getState());
    const file = networkFileSelector(state, networkId);
    downloadDataUrl(file._content, file.name ?? "network.dot", file.format);
  };
}

export function removeNetwork(paneId) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const networkState = networkStateSelector(state, paneId);
    dispatch({
      delay: true,
      group: `${paneId}/remove`,
      label: "Network: Remove Network",
      payload: {
        paneId,
        fileId: networkState.file,
      },
      type: "MICROREACT VIEWER/REMOVE NETWORK",
    });
  };
}

export function setLasso(networkId, isLassoActive) {
  return {
    delay: true,
    group: `${networkId}/lasso`,
    label: "Network: Toggle lasso",
    networkId,
    payload: isLassoActive,
    type: "MICROREACT VIEWER/SET NETWORK LASSO",
  };
}

export function setFilter(networkId, path = null) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    if (path !== null || state.filters?.selection?.length === 0) {
      dispatch({
        delay: true,
        group: `${networkId}/filter`,
        label: "Network: Change network filter",
        type: "MICROREACT VIEWER/SET NETWORK FILTER",
        networkId,
        payload: {
          path,
        },
      });
    }
  };
}

export function setLayout(networkId, layout) {
  return {
    delay: true,
    group: `${networkId}/filter`,
    label: "Network: Change network layout",
    type: "MICROREACT VIEWER/SET NETWORK LAYOUT",
    networkId,
    payload: {
      layout,
    },
  };
}

export function update(networkId, key, value) {
  return {
    delay: true,
    group: `${networkId}/${key}`,
    label:
      (key === "nodeSize") ? `Network: Set node size ${value}` :
        (key === "labelSize") ? `Map: Set label size to ${value}` :
          (key === "showLabels") ? "Map: Toggle scale labels" :
            (key === "showNodes") ? "Map: Toggle show nodes" :
              undefined,
    type: "MICROREACT VIEWER/UPDATE NETWORK",
    networkId,
    payload: { [key]: value },
  };
}
