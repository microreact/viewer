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
      return Array.from(
        intersect(arriesOfFields.map((x) => new Set(x)))
      );
    }
  },
);

export default allTreesMetadataFieldsSelector;
