import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const laneFieldSelector = createKeyedStateSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state, timelineId) => state.timelines[timelineId].laneField,
  (
    fieldsMap,
    laneField,
  ) => {
    if (laneField) {
      return fieldsMap.get(laneField);
    }
    else {
      return undefined;
    }
  },
);

export default laneFieldSelector;
