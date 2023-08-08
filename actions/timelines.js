import * as Datetime from "../utils/datetime";
import { getPresentState } from "../utils/state";

import { selectRows } from "./filters";

import styleSelector from "../selectors/timelines/style";
import rowsWithDateFieldSelector from "../selectors/timelines/rows-with-date-field";
import rowsWithStyleFieldsSelector from "../selectors/styles/rows-with-style-fields";
import fullRangeExtentSelector from "../selectors/timelines/full-range-extent";
import { addDays, addMonths } from "date-fns";

export function addYearMonthDayTimeline(title, yearFieldName, monthFieldName, dayFieldName) {
  return {
    type: "MICROREACT VIEWER/ADD TIMELINE",
    payload: {
      title,
      dataType: "year-month-day",
      yearField: yearFieldName,
      monthField: monthFieldName,
      dayField: dayFieldName,
    },
  };
}

export function addTimeline(paneId, title) {
  return {
    type: "MICROREACT VIEWER/ADD TIMELINE",
    payload: {
      paneId,
      title: title || "Timeline",
      dataType: "year-month-day",
    },
  };
}

export const applyTimelineFilter = (timelineId, filter) => (
  (dispatch, getState) => {

    const state = getPresentState(getState());
    const fullRangeExtent = fullRangeExtentSelector(state, timelineId);
    if (fullRangeExtent) {
      let upperTimestamp;
      if (filter === "7-days") {
        upperTimestamp = addDays(fullRangeExtent[1], -7);
      }
      else if (filter === "14-days") {
        upperTimestamp = addDays(fullRangeExtent[1], -14);
      }
      else if (filter === "30-days") {
        upperTimestamp = addDays(fullRangeExtent[1], -30);
      }
      else if (filter === "3-months") {
        upperTimestamp = addMonths(fullRangeExtent[1], -3);
      }
      else if (filter === "6-months") {
        upperTimestamp = addMonths(fullRangeExtent[1], -6);
      }
      else if (filter === "12-months") {
        upperTimestamp = addMonths(fullRangeExtent[1], -12);
      }
      dispatch(
        setFilter(
          timelineId,
          [
            upperTimestamp,
            fullRangeExtent[1],
          ],
        )
      );
    }
  }
);

export function removeTimeline(paneId) {
  return {
    delay: true,
    group: `${paneId}/remove`,
    label: "Timeline: Remove Timeline",
    payload: {
      paneId,
    },
    type: "MICROREACT VIEWER/REMOVE TREE",
  };
}

export const selectItem = (timelineId, item, merge) => (
  (dispatch, getState) => {
    let ids = false;

    if (item) {
      const state = getPresentState(getState());
      const style = styleSelector(state, timelineId);
      if (style === "bubble") {
        ids = item.sliceRows.map((row) => row[0]);
      }
      else {
        const { dateFieldName } = rowsWithDateFieldSelector(state, timelineId);
        const [rows] = rowsWithStyleFieldsSelector(state);
        const lowerTimestamp = item.unitStartDate.valueOf();
        const upperTimestamp = item.unitEndDate.valueOf();
        ids = [];
        for (const row of rows) {
          const timestamp = row[dateFieldName]?.valueOf();
          if (timestamp && row["--microreact-colour-label"] === item.groupLabel && timestamp >= lowerTimestamp && timestamp <= upperTimestamp) {
            ids.push(row[0]);
          }
        }
      }
    }

    dispatch(
      selectRows(
        ids,
        merge,
      )
    );
  }
);

export function setFilter(timelineId, bounds) {
  return {
    delay: true,
    group: `${timelineId}/filter`,
    label: `Timeline: Set timeline filter to [${bounds.map(Datetime.timestampToDateString).join(", ")}]`,
    payload: bounds || null,
    timelineId,
    type: "MICROREACT VIEWER/SET TIMELINE FILTER",
  };
}

export function update(timelineId, key, value) {
  return {
    delay: true,
    group: `${timelineId}/${key}`,
    label:
      (key === "style") ? `Timeline: Set timeline type to ${value}` :
        (key === "unit") ? `Timeline: Set time unit ${value}` :
          (key === "speed") ? `Timeline: Set playback speed to ${value}` :
            (key === "laneField") ? `Timeline: Set stack by column to ${value}` :
              (key === "nodeSize") ? `Timeline: Set bubble size to ${value}` :
                undefined,
    payload: { [key]: value },
    timelineId,
    type: "MICROREACT VIEWER/UPDATE TIMELINE",
  };
}
