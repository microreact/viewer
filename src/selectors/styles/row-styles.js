import { createSelector } from "reselect";

import rowsSelector from "../datasets/rows";
import rowsWithStyleFieldsSelector from "./rows-with-style-fields";

const baseStylesSelector = createSelector(
  (state) => rowsSelector(state),
  (
    allRows,
  ) => {
    const styles = {};

    for (const row of allRows) {
      styles[row[0]] = {};
    }

    return styles;
  },
);

const rowStylesSelector = createSelector(
  (state) => rowsWithStyleFieldsSelector(state),
  (state) => baseStylesSelector(state),
  (
    [ rows ],
    baseStyle,
  ) => {
    for (const row of rows) {
      const style = baseStyle[row[0]];

      style.label = row["--microreact-label"];
      style.colour = row["--microreact-colour"];
      style.colourLabel = row["--microreact-colour-label"];
      style.shape = row["--microreact-shape"];
    }

    return [ baseStyle ];
  },
);

export default rowStylesSelector;
