import { mapQueryToProps } from "../utils/query";
import {
  newId,
  updateAll as updateAllTimelines,
  updateKeyedState as updateTimeline,
} from "../utils/state";

const initialState = {
  bounds: null,
  controls: false,
  nodeSize: 14,
  playing: false,
  speed: 1,
  laneField: null,
  style: "bar",
  unit: null,
  viewport: null,
};

const queryPropMap = {
  controls: { key: "lc", type: Boolean },
  playing: { key: "lp", type: Boolean },
  speed: { key: "ls", type: Number },
  unit: {
    key: "lu",
    values: {
      year: "y",
      quarter: "q",
      month: "m",
      week: "w",
      day: "d",
    },
  },
  minNodeSize: { key: "lnns", type: Number },
  maxNodeSize: { key: "lxns", type: Number },
  nodeSize: { key: "lns", type: Number },
};

export default function (state = {}, action) {
  switch (action.type) {

    case "MICROREACT VIEWER/ADD TIMELINE": {
      return {
        ...state,
        [newId(state, "timeline")]: {
          ...initialState,
          title: action.payload.title,
          ...action.payload,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const timelines = {};
      for (const timelineId of Object.keys(action.payload.timelines)) {
        timelines[timelineId] = {
          ...initialState,
          ...action.payload.timelines[timelineId],
          ...mapQueryToProps(queryPropMap, action.payload.query),
        };
      }
      return timelines;
    }

    case "MICROREACT VIEWER/QUERY": {
      const queryState = mapQueryToProps(queryPropMap, action.payload);
      if (Object.keys(queryState)) {
        return updateAllTimelines(
          state,
          queryState,
        );
      }
      else {
        return state;
      }
    }

    case "MICROREACT VIEWER/RESET ALL FILTERS":
    case "MICROREACT VIEWER/RESET TIMELINE FILTERS": {
      return updateAllTimelines(
        state,
        { bounds: null },
      );
    }

    case "MICROREACT VIEWER/SET TIMELINE FILTER": {
      return updateTimeline(
        state,
        action.timelineId,
        { bounds: action.payload || null },
      );
    }

    case "MICROREACT VIEWER/UPDATE TIMELINE": {
      return updateTimeline(
        state,
        action.timelineId,
        action.payload,
      );
    }

    default:
      return state;
  }
}
