/* eslint-disable indent */
/* eslint-disable no-use-before-define */

import { nameWithoutExtention, loadFiles, loadFile, clearLoadedContent } from "../utils/files";

import { addDataset, updateDataset } from "./datasets";
import { addFile, updateFile } from "./files";
import { addGeographicCoordinatesMap, addGeoData } from "./maps";
import { addNetwork } from "./networks";
import { addTable } from "./tables";
import { addTree } from "./trees";
import { addNote } from "./notes";
import { addYearMonthDayTimeline } from "./timelines";

import mainDatasetConfigSelector from "../selectors/datasets/main-dataset-config";

import { detectAnnotationFields, createBasicDataset } from "../utils/datasets";
import { exportHtmlElementAsDataUrl, getContainerElement } from "../utils/html";
import { getPresentState, newId } from "../utils/state";
import { longestCommonStartingSubstring } from "../utils/text";
import { publish } from "../utils/events";
import { generateHashId } from "../utils/hash";
import { newickLabels } from "../utils/trees";

import updateSchema, { version } from "../schema";
import isValidTreeSelector from "../selectors/trees/is-valid-tree";
import isValidNetworkSelector from "../selectors/networks/is-valid-network";
import { emptyArray } from "../constants";
import { getPageHash, setPageHash } from "../utils/browser";
import { addMissingPaneTabs } from "../utils/panes";
import layoutModelSelector from "../selectors/panes/layout-model";
import { setLayoutModel } from "./panes";
import fullDatasetSelector from "../selectors/datasets/full-dataset";
import { addMatrix } from "./matrices";

function createLabelFromFileName(file, allFiles) {
  const hasMoreThanOfTheSameType = allFiles.filter((x) => x.type === file.type).length > 1;

  if (hasMoreThanOfTheSameType) {
    let fileName = file.name || file.id;
    if (allFiles.length > 1 && allFiles.every((x) => !!x.name)) {
      const prefix = longestCommonStartingSubstring(allFiles.map((x) => x.name));
      if (prefix && prefix.length) {
        fileName = fileName.substring(prefix.length);
      }
    }

    return nameWithoutExtention(fileName);
  }
  else {
    const fileNamesByType = {
      data: "Metadata",
      tree: "Tree",
      network: "Network",
      geo: "Regions",
      markdown: "Note",
      matrix: "Matrix",
    };
    return fileNamesByType[file.type] || file.id;
  }
}

export function addFiles(rawFiles, paneId, commit = true) {
  return async (dispatch, getState) => {
    const state = getPresentState(getState());
    dispatch(config({ isBuzy: true }));

    const filesToLoad = [ ...rawFiles ];
    for (const pendindFile of (state.config.pendingFiles || emptyArray)) {
      if (!filesToLoad.find((x) => x.id === pendindFile.id)) {
        filesToLoad.push(pendindFile);
      }
    }

    const fileDescriptors = await loadFiles(filesToLoad);
    if (paneId) {
      for (const file of fileDescriptors) {
        file.paneId = paneId;
      }
    }

    const failedFiles = fileDescriptors.filter((x) => !!x.error);

    if (failedFiles.length === 0) {
      if (fileDescriptors.length === 1 && fileDescriptors[0].type === "microreact") {
        return dispatch(load(fileDescriptors[0]._content));
      }
      else if (commit) {
        return dispatch(commitFiles(fileDescriptors));
      }
    }

    const nextPendingFiles = [ ...(state.config.pendingFiles || emptyArray) ];

    for (const processedFile of fileDescriptors) {
      const pendingFileIndex = nextPendingFiles.findIndex((x) => x.id === processedFile.id);
      if (pendingFileIndex >= 0) {
        nextPendingFiles[pendingFileIndex] = {
          ...nextPendingFiles[pendingFileIndex],
          ...processedFile,
        };
      }
      else {
        nextPendingFiles.push(processedFile);
      }
    }

    dispatch(
      config({
        isBuzy: false,
        pendingFiles: nextPendingFiles,
      })
    );
  };
}

export function addHistoryEntry(source, label) {
  return {
    label: `${source}: ${label}`,
    payload: undefined,
    savable: false,
    type: "MICROREACT VIEWER/ADD HISTORY ENTRY",
  };
}

export function batch(actions) {
  return {
    payload: actions,
    savable: false,
    type: "MICROREACT VIEWER/BATCH",
  };
}

export function commitFiles(fileDescriptors) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const isEmpty = !fullDatasetSelector(state);
    const actions = [];
    const paneIds = [];
    const orphanPanes = [];

    let hasDataFiles = !isEmpty;

    for (const file of fileDescriptors) {
      actions.push(
        addFile(file)
      );
      if (file.type === "data") {
        hasDataFiles = true;

        const dataset = file._content;
        actions.push(
          addDataset(
            file.id,
          )
        );
        const { dataFields } = detectAnnotationFields(dataset.columns);
        const paneId = file.paneId || newId(state.tables, "table", paneIds);
        paneIds.push(paneId);
        const label = createLabelFromFileName(file, fileDescriptors);

        actions.push(
          addTable(
            paneId,
            label,
            file.id,
            dataFields.map(
              (field) => ({
                field: field.name,
                fixed: field.name === (file.idFieldName || file.linkFieldName),
              })
            ),
          )
        );

        if (!file.paneId) {
          orphanPanes.push({
            paneId,
            label,
            component: "Table",
          });
        }

        //#region Add a map if the data file includes default LATITUDE and LONGITUDE columns
        const latitudeField = dataset.columns.find((x) => /(__LATITUDE$)|(^LATITUDE$)/i.test(x.name));
        const longitudeField = dataset.columns.find((x) => /(__LONGITUDE$)|(^LONGITUDE$)/i.test(x.name));
        if (latitudeField && longitudeField) {
          actions.push(
            addGeographicCoordinatesMap(
              "Map",
              latitudeField.name,
              longitudeField.name,
            )
          );
        }
        //#endregion

        //#region Add a timeline if data include YEAR, MONTH, and DAY columns
        const yearField = dataset.columns.find((x) => /(__year$)|(^year$)/i.test(x.name));
        const monthField = dataset.columns.find((x) => /(__month$)|(^month$)/i.test(x.name));
        const dayField = dataset.columns.find((x) => /(__day$)|(^day$)/i.test(x.name));
        if (yearField) {
          actions.push(
            addYearMonthDayTimeline(
              "Timeline",
              yearField.name,
              monthField ? monthField.name : undefined,
              dayField ? dayField.name : undefined,
            )
          );
        }
        //#endregion
      }
      else if (file.type === "matrix") {
        if (!hasDataFiles) {
          const matrixLabels = file._content.rows.map((x) => x[file._content.columns[0].name]);
          const dataFile = {
            id: generateHashId(),
            name: "matrix-labels",
            format: "text/csv",
            blob: new File(
              [ `id\n${matrixLabels.join("\n")}` ],
              "matrix-labels.csv",
              { type: "text/csv" },
            ),
            type: "data",
            _content: createBasicDataset(matrixLabels.map((id) => ({ id }))),
          };
          actions.push(
            addFile(dataFile)
          );
          actions.push(
            addDataset(
              dataFile.id,
              { idFieldName: "id" }
            )
          );
          const label = createLabelFromFileName(dataFile, fileDescriptors);
          actions.push(
            addTable(
              null,
              label,
              dataFile.id,
              [
                { field: "id" },
              ],
            )
          );
          file.labelFieldName = "id";
        }

        const paneId = file.paneId || newId(state.matrices, "matrix", paneIds);
        paneIds.push(paneId);
        const label = createLabelFromFileName(file, fileDescriptors);
        actions.push(
          addMatrix(
            paneId,
            label,
            file.id,
          )
        );
        if (!file.paneId) {
          orphanPanes.push({
            paneId,
            label,
            component: "Matrix",
          });
        }
      }
      else if (file.type === "tree") {
        if (!hasDataFiles) {
          const leafLabels = newickLabels(file._content);
          const dataFile = {
            id: generateHashId(),
            name: "tree-labels",
            format: "text/csv",
            blob: new File(
              [ `id\n${leafLabels.join("\n")}` ],
              "tree-labels.csv",
              { type: "text/csv" },
            ),
            type: "data",
            _content: createBasicDataset(leafLabels.map((id) => ({ id }))),
          };
          actions.push(
            addFile(dataFile)
          );
          actions.push(
            addDataset(
              dataFile.id,
              { idFieldName: "id" }
            )
          );
          const label = createLabelFromFileName(dataFile, fileDescriptors);
          actions.push(
            addTable(
              null,
              label,
              dataFile.id,
              [
                { field: "id" },
              ],
            )
          );
          file.labelFieldName = "id";
        }
        const paneId = file.paneId || newId(state.trees, "tree", paneIds);
        paneIds.push(paneId);
        const label = createLabelFromFileName(file, fileDescriptors);
        actions.push(
          addTree(
            paneId,
            label,
            file.id,
            file.labelFieldName,
          )
        );
        if (!file.paneId) {
          orphanPanes.push({
            paneId,
            label,
            component: "Tree",
          });
        }
      }
      else if (file.type === "network") {
        const paneId = file.paneId || newId(state.networks, "network", paneIds);
        paneIds.push(paneId);
        const label = createLabelFromFileName(file, fileDescriptors);
        actions.push(
          addNetwork(
            paneId,
            label,
            file.id,
            file.labelFieldName,
          )
        );
        if (!file.paneId) {
          orphanPanes.push({
            paneId,
            label,
            component: "Network",
          });
        }
      }
      else if (file.type === "markdown") {
        const paneId = file.paneId || newId(state.notes, "note", paneIds);
        paneIds.push(paneId);
        const label = createLabelFromFileName(file, fileDescriptors);
        actions.push(
          addNote(
            paneId,
            label,
            file._content,
          )
        );
        if (!file.paneId) {
          orphanPanes.push({
            paneId,
            label,
            component: "Note",
          });
        }
      }
      else if (file.type === "geo") {
        actions.push(
          addGeoData(
            file.paneId,
            file.id,
            {
              linkType: file.linkType,
              linkFieldName: file.masterFieldName,
              linkPropertyName: file.linkPropertyName,
            },
          )
        );
      }
    }

    actions.push(
      config({
        isBuzy: false,
        pendingFiles: null,
      })
    );
    if (orphanPanes.length && state.panes.model) {
      actions.push(
        setLayoutModel(
          addMissingPaneTabs(
            layoutModelSelector(state),
            orphanPanes,
          )
        )
      );
    }

    dispatch(
      batch(actions)
    );

    dispatch(verify());
  };
}

export function config(payload) {
  return {
    payload,
    savable: false,
    type: "MICROREACT VIEWER/CONFIG",
  };
}

export function closePaneEditor(paneId) {
  return config({ editor: null });
}

export function fetchFile(fileId, rawFile) {
  return async (dispatch) => {
    dispatch(config({ isBuzy: true }));
    try {
      rawFile.id = fileId;
      const processedFile = await loadFile(rawFile);
      return dispatch(
        batch([
          updateFile(processedFile),
          config({ isBuzy: false }),
        ])
      );
    }
    catch (err) {
      console.error(err);
      return dispatch(
        config({ processingError: err.message || err })
      );
    }
  };
}

export function addOrUpdateFile(fileId, paneId, rawFile) {
  return async (dispatch) => {
    if (fileId) {
      return dispatch(fetchFile(fileId, rawFile));
    }
    else {
      return dispatch(addFiles([ rawFile ], paneId));
    }
  };
}

export function openPaneEditor(paneId) {
  return config({
    editor: {
      mode: "edit",
      paneId,
    },
  });
}

export function load(payload) {
  return (dispatch) => {
    if (payload.files) {
      payload.files = clearLoadedContent(payload.files);
    }

    const loadMainDocumentAction = dispatch(loadDocument(payload));

    if (payload.schema && payload.views) {
      const currentViewId = getPageHash() || payload.views.find((x) => x.isDefault)?.meta?.id;
      if (currentViewId) {
        const viewDocument = payload.views.find((x) => x.meta.id === currentViewId);
        if (viewDocument) {
          dispatch(loadView(viewDocument));
        }
      }
    }

    return loadMainDocumentAction;
  };
}

export function loadDocument(payload) {
  return (dispatch) => {
    // TODO: no need to show a loader as files are not fetched here
    const doc = updateSchema(payload);
    return dispatch({
      label: doc.schema ? "Project: Load project" : "Project: Load view",
      payload: doc,
      savable: false,
      type: "MICROREACT VIEWER/LOAD",
    });
  };
}

export function loadView(viewDocument) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    setPageHash(viewDocument.meta.id, viewDocument.meta.name);
    return (
      dispatch(
        loadDocument(
          {
            ...viewDocument,
            files: state.files,
            meta: state.meta,
            views: state.views,
          }
        )
      )
    );
  };
}

export function reset() {
  return {
    payload: updateSchema(),
    savable: false,
    type: "MICROREACT VIEWER/LOAD",
  };
}

export function setPendingFiles(nextPendingFiles) {
  return config({
    pendingFiles: nextPendingFiles,
  });
}

export function save() {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => publish("before-screenshot"))
      .then(
        () => exportHtmlElementAsDataUrl(
          getContainerElement().querySelector("main.MuiPaper-root"),
          true /* resize */,
        )
      )
      .then(async (image) => {
        publish("after-screenshot");

        const state = getPresentState(getState());
        const doc = { ...state };

        // Set schema and metadata
        doc.schema = `https://microreact.org/schema/v${version}.json`;
        doc.meta = { ...doc.meta };
        doc.meta.image = image;
        doc.meta.timestamp = (new Date()).toISOString();

        // Remove config attributes
        doc.config = undefined;

        // Serialise file blobs and remove file loaded content
        doc.files = clearLoadedContent(doc.files);

        return doc;
      });
  };
}

export function setMasterDataset(datasetId) {
  return (dispatch, getState) => {
    dispatch(
      updateDataset(
        datasetId,
        { idFieldName: "" },
      )
    );

    dispatch(verify());
  };
}

export function query(updater) {
  return {
    delay: true,
    payload: updater,
    savable: false,
    type: "MICROREACT VIEWER/QUERY",
  };
}

export function verify() {
  return (dispatch, getState) => {
    const state = getPresentState(getState());

    //#region Check that all files are loaded without errors
    //#endregion

    //#region Check that Dataset has an ID column
    if (state.datasets) {
      const masterDataset = mainDatasetConfigSelector(state);
      if (!masterDataset || !masterDataset.idFieldName) {
        const paneId = (
          masterDataset
           ?
           Object.entries(state.tables).find(([ tableId, tableState]) => tableState.file === masterDataset.file)[0]
           :
           Object.keys(state.tables)[0]
        );
        return dispatch(
          config({
            editor: {
              mode: "validation",
              paneId,
            },
          })
        );
      }
      for (const dataset of Object.values(state.datasets)) {
        if (!dataset.idFieldName && (!dataset.masterFieldName || !dataset.linkFieldName)) {
          return dispatch(
            config({
              editor: {
                mode: "validation",
                paneId: Object.entries(state.tables).find(([ tableId, tableState]) => tableState.file === dataset.file)[0],
              },
            })
          );
        }
      }
    }
    //#endregion

    //#region Check that all tree files are linked
    for (const treeId of Object.keys(state.trees)) {
      if (!isValidTreeSelector(state, treeId)) {
        return dispatch(
          config({
            editor: {
              mode: "validation",
              paneId: treeId,
            },
          })
        );
      }
    }
    //#endregion

    //#region Check that all network files are linked
    for (const networkId of Object.keys(state.networks)) {
      if (!isValidNetworkSelector(state, networkId)) {
        return dispatch(
          config({
            editor: {
              mode: "validation",
              paneId: networkId,
            },
          })
        );
      }
    }
    //#endregion

    dispatch(
      config({
        editor: null,
      })
    );
  };
}

export function unload() {
  return {
    savable: false,
    type: "MICROREACT VIEWER/UNLOAD",
  };
}
