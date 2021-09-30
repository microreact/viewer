import { createKeyedStateSelector } from "../../utils/state";

import temporalDataSelector from "./-temporal-data";
import paneSizeSelector from "../panes/pane-size";
import * as Datetime from "../../utils/datetime";

const sliderUnitSelector = createKeyedStateSelector(
  (state, timelineId) => temporalDataSelector(state, timelineId),
  (state, timelineId) => paneSizeSelector(state, timelineId),
  (
    temporalData,
    size,
  ) => {
    if (temporalData.length) {
      const fristDate = temporalData[0][0];
      const lastDate = temporalData[temporalData.length - 1][0];

      return Datetime.unitFromRange(
        [
          fristDate.valueOf(),
          lastDate.valueOf(),
        ],
        size.width / 8,
      );
    }
    else {
      return "day";
    }
  },
);

const sliderVegaDataSelector = createKeyedStateSelector(
  (state, timelineId) => temporalDataSelector(state, timelineId),
  (state, timelineId) => sliderUnitSelector(state, timelineId),
  (
    temporalData,
    unit,
  ) => {
    const groups = Datetime.groupTemporalData(
      temporalData,
      unit,
    );

    const dataset = [];

    for (const group of groups) {
      dataset.push({
        label: group.groupLabel,
        startDate: group.groupStartDate,
        endDate: group.groupEndDate,
        rows: group.rows.length,
      });
    }

    return { dataset };
  },
);

export default sliderVegaDataSelector;
