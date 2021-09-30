import { selectRows } from "../actions/filters";
import { setSidePane } from "../actions/panes";
import { setLegendDirection } from "../actions/styles";

import Component from "../components/LegendPane.react";
import legendsSelector from "../selectors/styles/legends";
import { connectToPresentState } from "../utils/state";

function mapStateToProps(state) {
  return {
    direction: state.styles.legendDirection,
    legends: legendsSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(setSidePane()),
    onDirectionChange: (direction) => dispatch(setLegendDirection(direction)),
    onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
