import { createKeyedStateSelector } from "../../utils/state";
import * as Datetime from "../../utils/datetime";

import temporalDataSelector from "./-temporal-data";
import filteredRangeUnitSelector from "./filtered-range-unit";

const groupedByUnitDataSelector = createKeyedStateSelector(
  (state, timelineId) => temporalDataSelector(state, timelineId),
  (state, timelineId) => filteredRangeUnitSelector(state, timelineId),
  (
    temporalData,
    unit,
  ) => {
    const groupedData = Datetime.groupTemporalData(
      temporalData,
      unit,
    );

    return groupedData;
  },
);

export default groupedByUnitDataSelector;
