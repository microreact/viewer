import { connect } from "react-redux";

import {
  resetAllFilters,
  resetMapFilters,
  resetNetworkFilters,
  resetTableFilters,
  resetTimelineFilters,
  resetTreeFilters,
  setSearchOperator,
  setSearchValue,
} from "../actions/filters";

// import { setMapFilter } from "../actions/map";
// import { setFilter } from "../actions/networks";
// import { resetTableFilter } from "../actions/table";
// import { setTreeFilter } from "../actions/trees";

import hasMapsSelector from "../selectors/maps/has-maps";
import hasNetworksSelector from "../selectors/networks/has-networks";
import hasTimelinesSelector from "../selectors/timelines/has-timelines";
import hasTreesSelector from "../selectors/trees/has-trees";
import numberOfFilteredRowsSelector from "../selectors/filters/number-of-filtered-rows";
import numberOfSelectedRowsSelector from "../selectors/filters/number-of-selected-rows";
import visibleRowCountSelector from "../selectors/filters/visible-row-count";
import numberOfRowsSelector from "../selectors/datasets/number-of-rows";
import SearchBox from "../components/SearchBox.react";

const mapStateToProps = (state) => ({
  filteredRowCount: numberOfFilteredRowsSelector(state),
  hasNetworks: hasNetworksSelector(state),
  hasMaps: hasMapsSelector(state),
  hasTimelines: hasTimelinesSelector(state),
  hasTrees: hasTreesSelector(state),
  rowCount: numberOfRowsSelector(state),
  searchOperator: state.filters.searchOperator,
  searchValue: state.filters.searchValue,
  selectedRowCount: numberOfSelectedRowsSelector(state),
  visibleRowCount: visibleRowCountSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  onResetAllFilters: () => dispatch(resetAllFilters()),
  onResetMapFilters: () => dispatch(resetMapFilters()),
  onResetNetworkFilters: () => dispatch(resetNetworkFilters()),
  onResetTableFilters: () => dispatch(resetTableFilters()),
  onResetTimelineFilters: () => dispatch(resetTimelineFilters()),
  onResetTreeFilters: () => dispatch(resetTreeFilters()),
  onSearchOperatorChange: (operator) => dispatch(setSearchOperator(operator)),
  onSearchValueChange: (value) => dispatch(setSearchValue(value)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(SearchBox);
