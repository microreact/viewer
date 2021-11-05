import { unitFromRange } from "../../utils/datetime";
import { createKeyedStateSelector } from "../../utils/state";
import paneSizeSelector from "../panes/pane-size";
import dataExtentSelector from "./data-extent";

const autoUnitSelector = createKeyedStateSelector(
  (state, timelineId) => dataExtentSelector(state, timelineId),
  (state, timelineId) => paneSizeSelector(state, timelineId),
  (
    filterExtent,
    size,
  ) => {
    if (filterExtent) {
      const unit = unitFromRange(
        filterExtent,
        size.width / 4
      );

      return unit;
    }

    return null;
  },
);

const filteredRangeUnitSelector = (state, timelineId) => {
  return state.timelines[timelineId].unit ?? autoUnitSelector(state, timelineId);
};

export default filteredRangeUnitSelector;
