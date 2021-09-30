// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import objectSupport from "dayjs/plugin/objectSupport";
// import advancedFormat from "dayjs/plugin/advancedFormat";
// import weekYear from "dayjs/plugin/weekYear";
// import weekOfYear from "dayjs/plugin/weekOfYear";
// import quarterOfYear from "dayjs/plugin/quarterOfYear";
// import relativeTime from "dayjs/plugin/relativeTime";
// import duration from "dayjs/plugin/duration";

// dayjs.extend(relativeTime);
// dayjs.extend(duration);
// dayjs.extend(customParseFormat);
// dayjs.extend(objectSupport);
// dayjs.extend(weekOfYear);
// dayjs.extend(weekYear);
// dayjs.extend(advancedFormat);
// dayjs.extend(quarterOfYear);

import {
  differenceInCalendarDays,
  differenceInCalendarISOWeeks,
  differenceInCalendarMonths,
  differenceInCalendarQuarters,
  differenceInCalendarYears,
  differenceInDays,
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  formatDistance,
  fromUnixTime,
  parse,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";

const NOW = new Date();

export const groupFormatStrings = {
  year: "yyyy",
  quarter: "yyyy-QQQ",
  month: "yyyy-MM",
  week: "RRRR-'W'II",
  day: "yyyy-MM-dd",
};

const formats = {
  "YYYY-M-D": "yyyy-M-d",
  "DD/MM/YYYY": "dd/MM/yyyy",
  "YYYY/M/D": "yyyy/M/d",
  "M/D/YYYY": "M/d/yyyy",
  "MMMM DD, YYYY": "MMMM dd, yyyy",
  "MMM DD, YYYY": "MMM dd, yyyy",
  "MMMM Do, YYYY": "MMMM do, yyyy",
  "MMM Do, YYYY": "MMM do, yyyy",
};

export function isTimestamp(value) {
  return Number.isFinite(value);
}

export function isValidDateInstance(value) {
  return value instanceof Date;
}

export function fromTimestamp(value) {
  return new Date(value);
}

export function timestampToDateString(value) {
  return (value instanceof Date ? value : new Date(value)).toLocaleDateString();
}

export function timestampToISODate(value) {
  return (value instanceof Date ? value : new Date(value)).toISOString().substring(0, 10);
}

export function ISODateToTimestamp(value) {
  return (value instanceof Date ? value : new Date(value)).valueOf();
}

export function unitFromRange(
  extent,
  numberOfBars,
) {
  const [ startTimestamp, endTimestamp ] = extent;
  const rangeInDays = differenceInDays(endTimestamp, startTimestamp);

  // const numberOfBars = size / barSize;

  if (rangeInDays < numberOfBars) {
    return "day";
  }

  if ((rangeInDays / 7) < numberOfBars) {
    return "week";
  }

  if ((rangeInDays / 30) < numberOfBars) {
    return "month";
  }

  if ((rangeInDays / 90) < numberOfBars) {
    return "quarter";
  }

  return "year";
}

export function rangeToDurationDistance([ startTimestamp, endTimestamp ]) {
  const label = formatDistance(startTimestamp, endTimestamp);
  return label;
}

export function rangeLength([ startTimestamp, endTimestamp ], unit) {
  if (unit === "year") {
    return differenceInCalendarYears(endTimestamp, startTimestamp);
  }

  if (unit === "quarter") {
    return differenceInCalendarQuarters(endTimestamp, startTimestamp);
  }

  if (unit === "month") {
    return differenceInCalendarMonths(endTimestamp, startTimestamp);
  }

  if (unit === "week") {
    return differenceInCalendarISOWeeks(endTimestamp, startTimestamp);
  }

  if (unit === "day") {
    return differenceInCalendarDays(endTimestamp, startTimestamp);
  }

  throw new Error(`Invalid unit ${unit}`);
}

export function boundsOf(value, unit) {
  if (unit === "year") {
    return [
      startOfYear(value),
      endOfYear(value),
    ];
  }

  if (unit === "quarter") {
    return [
      startOfQuarter(value),
      endOfQuarter(value),
    ];
  }

  if (unit === "month") {
    return [
      startOfMonth(value),
      endOfMonth(value),
    ];
  }

  if (unit === "week") {
    return [
      startOfWeek(value, { weekStartsOn: 1 }), // ISO Week starts on Monday (1). See https://en.wikipedia.org/wiki/ISO_week_date
      endOfWeek(value, { weekStartsOn: 1 }),
    ];
  }

  if (unit === "day") {
    return [
      startOfDay(value),
      endOfDay(value),
    ];
  }

  throw new Error(`Invalid unit ${unit}`);
}

export function groupTemporalData(temporalData, unit) {
  const groups = {};
  const groupByTimestamp = new Map();

  for (const [ value, row ] of temporalData) {
    const timestampValue = value.valueOf();
    let key = groupByTimestamp.get(timestampValue);
    if (key === undefined) {
      key = toUnitString(value, unit);
      groupByTimestamp.set(timestampValue, key);
    }

    if (groups[key]) {
      groups[key].rows.push(row);
    }
    else {
      const [ groupStartDate, groupEndDate ] = boundsOf(value, unit);
      groups[key] = {
        groupLabel: key,
        groupStartDate,
        groupEndDate,
        rows: [ row ],
      };
    }
  }

  const groupedData = Object.values(groups);

  return groupedData;
}

export function toDateInstance(value, formatString = undefined) {
  const praseFormatString = formats[formatString];
  if (praseFormatString) {
    return parse(value, praseFormatString, NOW);
  }
  else {
    return parseISO(value);
  }
}

export function timestampToDateInstance(value) {
  return fromUnixTime(value);
}

export function isoDateToDateInstance(value) {
  return parseISO(value);
}

export function toUnitString(dateInstance, unit) {
  return format(dateInstance, groupFormatStrings[unit]);
}
