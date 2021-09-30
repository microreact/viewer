import { createSelector } from "reselect";
import { emptyArray } from "../../constants";

export default createSelector(
  (state) => state.ui.pending || emptyArray,
  (
    pendingFiles,
  ) => {
    const list = [];

    const dataFiles = pendingFiles.filter((x) => x.type === "data");
    for (const file of pendingFiles) {
      let isReady = false;

      if (file.type === "data") {
        if (dataFiles.length === 1 || file.joinFieldName) {
          isReady = true;
        }
      }
      else if (file.type === "tree" && file.labelFieldName) {
        isReady = true;
      }
      else if (file.type === "network" && file.labelFieldName) {
        isReady = true;
      }

      list.push({
        ...file,
        isReady,
      });
    }

    return list;
  },
);
