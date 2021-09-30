import { createSelector } from "reselect";

import idFieldNameSelector from "./id-field-name";
import mainDatasetConfigSelector from "./main-dataset-config";

import { createFullDataset, mergeBasicDatasets } from "../../utils/datasets";
import { emptyObject } from "../../constants";

const fullDatasetSelector = createSelector(
  (state) => state.datasets,
  (state) => state.files,
  (state) => mainDatasetConfigSelector(state),
  (state) => idFieldNameSelector(state),
  (
    datasetConfigs,
    files,
    mainDatasetConfig,
    idFieldName,
  ) => {
    const allDatasetConfigs = Object.values(datasetConfigs);

    if (mainDatasetConfig?.file && files[mainDatasetConfig?.file]?._content) {
      let mergedDataset = files[mainDatasetConfig.file]._content;

      const otherDatasets = allDatasetConfigs.filter((x) => x.idFieldName === undefined);
      for (const datasetConfig of otherDatasets) {
        if (datasetConfig.masterFieldName && datasetConfig.linkFieldName && files[datasetConfig?.file]?._content) {
          mergedDataset = mergeBasicDatasets(
            mergedDataset,
            files[datasetConfig.file]._content,
            datasetConfig.masterFieldName,
            datasetConfig.linkFieldName,
          );
        }
      }

      const finalDataset = createFullDataset(mergedDataset);

      for (const field of Object.keys(mainDatasetConfig.columns || emptyObject)) {
        const column = finalDataset.columns.find((x) => x.name === field);
        column.userDataType = mainDatasetConfig.columns[field].dataType;
      }

      for (const row of finalDataset.rows) {
        row[0] = row[idFieldName]?.toString();
        if (mainDatasetConfig?.aggregation) {
          row["--mr-scalar"] = row[mainDatasetConfig.aggregation] ?? 0;
        }
        else {
          row["--mr-scalar"] = row["--mr-scalar"] ?? 1;
        }
      }

      return finalDataset;
    }

    return undefined;
  },
);

export default fullDatasetSelector;
