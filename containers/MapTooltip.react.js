import rowsByRegionSelector from "../selectors/maps/rows-by-region";

import MapTooltip from "../components/MapTooltip.react";
import { connectToPresentState } from "../utils/state";
import totalRowCountByRegionSelector from "../selectors/maps/total-row-count-by-region";
import entryLabelsSelector from "../selectors/config/entry-labels";

const mapStateToProps = (state, { mapId }) => {
  return {
    rowsByRegion: rowsByRegionSelector(state, mapId),
    totalRowCountByRegion: totalRowCountByRegionSelector(state, mapId),
    entryLabels: entryLabelsSelector(state),
  };
};

export default connectToPresentState(MapTooltip, mapStateToProps);
