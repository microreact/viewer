import rowsByRegionSelector from "../selectors/maps/rows-by-region";

import MapTooltip from "../components/MapTooltip.react";
import { connectToPresentState } from "../utils/state";

const mapStateToProps = (state, { mapId }) => {
  return {
    rowsByRegion: rowsByRegionSelector(state, mapId),
  };
};

export default connectToPresentState(MapTooltip, mapStateToProps);
