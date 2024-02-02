import { timestampToDateString } from "./datetime";

let context;
let correctionUnit;

function createContext() {
  const canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  const font = "400 14px Work Sans, Helvetica, Arial, sans-serif";
  context.font = font;
  correctionUnit = context.measureText(" ").width * 2.2;
  return context;
}

export function measureWidth(text, strong = false) {
  // const weight = strong ? 700 : 400;
  // context.font = `${weight} ${font}`;
  const textMetrics = (context ?? createContext()).measureText(text);
  return Math.ceil(textMetrics.width + correctionUnit);
}

export function longestCommonStartingSubstring(arr1) {
  const arr = arr1.concat().sort();
  const a1 = arr[0];
  const a2 = arr[arr.length - 1];
  const L = a1.length;
  let i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) {
    i += 1;
  }
  return a1.substring(0, i);
}

export function entriesLabel(number) {
  return number === 1 ? "entry" : "entries";
}

export function toText(dataType, value, convertBlanks = true) {
  if (value === null || value === undefined || value === "") {
    if (convertBlanks) {
      return "(blank)";
    }
    else {
      return "";
    }
  }

  if (dataType === "date" || dataType === "timestamp") {
    return timestampToDateString(value);
  }

  if (dataType === "boolean") {
    return (value === true) ? "✅" : (value === false) ? "❌" : null;
  }

  else {
    return value?.toString();
  }
}
