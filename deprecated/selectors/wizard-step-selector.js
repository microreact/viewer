import { createSelector } from "reselect";
import { findGeoJSONPropertyNames } from "../../utils/loaders/json";
import masterDatasetSelector from "../datasets/master-dataset";
import fileSelector from "../files/file";

import pendingFilesSelector from "./pending-files";
import showProcessFilesSelector from "./show-process-files";

const masterDataFileSelector = (state) => {
  const masterDataset = masterDatasetSelector(state);
  if (masterDataset) {
    const masterDataFile = fileSelector(state, masterDataset.file);
    return {
      ...masterDataFile,
      idFieldName: masterDataset.idFieldName,
    };
  }
  else if (state.ui.pending) {
    return state.ui.pending.find((x) => x.idFieldName);
  }
  else {
    return undefined;
  }
};

const wizardStepSelector = createSelector(
  (state) => showProcessFilesSelector(state),
  (state) => pendingFilesSelector(state),
  (state) => masterDataFileSelector(state),
  (state) => state.ui.processingError,
  (state) => state.ui.showPendingFilesList,
  (
    showProcessFiles,
    pendingFiles,
    masterDataFile,
    processingError,
    showPendingFilesList,
  ) => {
    if (processingError) {
      return {
        name: "error",
        title: "Error",
        error: processingError,
      };
    }

    if (!showProcessFiles) {
      return null;
    }

    const unprocessedFiles = pendingFiles.filter((x) => !x.proccessed);
    const failedFiles = pendingFiles.filter((x) => !!x.error);
    const unknownFiles = pendingFiles.filter((x) => x.type === "unknown");

    if (showPendingFilesList || unknownFiles.length > 0 || failedFiles.length > 0 || pendingFiles.length === 0) {
      return {
        name: "list-files",
        title: "Add Files or URLs",
        files: pendingFiles,
      };
    }

    if (unprocessedFiles.length === 0) {
      return { name: "ready" };
    }

    const masterDataFields = masterDataFile?.content?.fields;
    const unprocessedFile = unprocessedFiles[0];

    if (unprocessedFile.type === "data") {
      if (!masterDataFile) {
        const dataFiles = pendingFiles.filter((x) => x.type === "data");
        const firstDataFile = (dataFiles.length === 1) ? dataFiles[0] : null;
        return {
          name: "select-master-file",
          title: "Select ID Field",
          masterDataFile: firstDataFile,
          idDataField: firstDataFile ? firstDataFile.content.fields.find((x) => x.normalised === "__id" || x.normalised === "id" || x.normalised === "name") : undefined,
          dataFiles: pendingFiles.filter((x) => x.type === "data"),
        };
      }
      else {
        const linkDataFields = unprocessedFile.content.fields;
        const commonField = masterDataFields.find(
          (masterDataField) => linkDataFields.find((linkDataField) => linkDataField.normalised === masterDataField.normalised)
        );
        return {
          name: "link-data-file",
          title: `Link Data File: ${unprocessedFile.name}`,
          masterDataFile,
          masterDataField: commonField ? masterDataFields.find((x) => x.normalised === commonField.normalised) : null,
          linkDataFile: unprocessedFile,
          linkDataField: commonField ? linkDataFields.find((x) => x.normalised === commonField.normalised) : null,
        };
      }
    }
    else if (unprocessedFile.type === "tree") {
      return {
        name: "link-tree-file",
        title: `Link Tree File: ${unprocessedFile.name}`,
        treeFile: unprocessedFile,
        masterDataFile,
        idDataField: masterDataFields.find((x) => x.name === masterDataFile.idFieldName),
      };
    }
    else if (unprocessedFile.type === "network") {
      return {
        name: "link-network-file",
        title: `Link Network File: ${unprocessedFile.name}`,
        networkFile: unprocessedFile,
        masterDataFile,
        masterDataField: masterDataFields.find((x) => x.name === masterDataFile.idFieldName),
      };
    }
    else if (unprocessedFile.type === "geo") {
      const allPropertyNames = findGeoJSONPropertyNames(unprocessedFile.content);
      const commonField = masterDataFields.find(
        (masterDataField) => allPropertyNames.find((propertyName) => propertyName.toString() === masterDataField.normalised)
      );
      return {
        name: "link-geo-file",
        title: `Link GeoJSON File: ${unprocessedFile.label}`,
        linkFile: unprocessedFile,
        allPropertyNames,
        masterDataFile,
        masterDataField: commonField ? masterDataFields.find((x) => x.normalised === commonField.normalised) : undefined,
        linkPropertyName: commonField ? allPropertyNames.find((x) => x === commonField.normalised) : undefined,
      };
    }

    return {
      name: "invalid-file",
      title: `Invalid File: ${unprocessedFile.label}`,
      file: unprocessedFile,
    };
  },
);

export default wizardStepSelector;
