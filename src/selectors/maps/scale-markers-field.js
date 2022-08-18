import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import mapStateSelector from "./map-state";

const scaleMarkersFieldSelector = createKeyedStateSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state, mapId) => mapStateSelector(state, mapId).scaleByField,
  (
    fieldsMap,
    scaleByField,
  ) => {
    if (scaleByField) {
      return fieldsMap.get(scaleByField);
    }
    else {
      return undefined;
    }
  },
);

export default scaleMarkersFieldSelector;
