import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const regionsColourMethodTypeSelector = createKeyedStateSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state, mapId) => state.maps[mapId].regionsColourField,
  (
    fieldsMap,
    regionsColourFieldName,
  ) => {
    if (regionsColourFieldName) {
      const regionsColourDataField = fieldsMap.get(regionsColourFieldName);
      return regionsColourDataField.isNumeric ? "continuous" : "discrete";
    }
    else {
      return undefined;
    }
  },
);

export default regionsColourMethodTypeSelector;
