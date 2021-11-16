import { createCombinedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";

import metadataFieldsSelector from "./metadata-fields";
import { emptyArray } from "../../constants";

const allTreesMetadataFieldsSelector = createCombinedStateSelector(
  (state) => state.trees,
  metadataFieldsSelector,
  (arriesOfFields) => {
    if (arriesOfFields.length === 0) {
      return emptyArray;
    }
    else if (arriesOfFields.length === 1) {
      return arriesOfFields[0];
    }
    else {
      const union = new Set();
      for (const array of arriesOfFields) {
        for (const element of array) {
          union.add(element);
        }
      }
      return Array.from(union);
    }
  },
);

export default allTreesMetadataFieldsSelector;
