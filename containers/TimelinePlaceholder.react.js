import { openPaneEditor } from "../actions/ui";
import isValidTimelineSelector from "../selectors/timelines/is-valid-timeline";
import { connectToPresentState } from "../utils/state";

import Component from "../components/PanePlaceholder.react";
import TimelinePane from "./TimelinePane.react";

const mapStateToProps = (state, { timelineId }) => {
  return {
    componentName: "Timeline",
    isEmpty: !isValidTimelineSelector(state, timelineId),
    PaneComponent: TimelinePane,
    paneId: timelineId,
  };
};

const mapDispatchToProps = (dispatch, { timelineId }) => ({
  onEditPane: () => dispatch(openPaneEditor(timelineId)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
