import { unitFromRange } from "../../utils/datetime";
import { createKeyedStateSelector } from "../../utils/state";
import paneSizeSelector from "../panes/pane-size";
import filteredRangeExtentSelector from "./filtered-range-extent";

const autoUnitSelector = createKeyedStateSelector(
  (state, timelineId) => filteredRangeExtentSelector(state, timelineId),
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
