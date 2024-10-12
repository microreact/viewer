/* eslint-disable no-undef */

import { document as globalDocument } from "global/document";

export function getCssVariable(variable) {
  const computedStyle = getComputedStyle(
    (globalDocument ?? document).body
  );
  return computedStyle.getPropertyValue(variable);
}
