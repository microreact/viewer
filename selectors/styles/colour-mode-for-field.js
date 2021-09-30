import colourPaletteForFieldSelector from "./colour-palette-for-field";

/**
 * Returns the colour palette used for a field
 */
const colourModeForFieldSelector = (
  state,
  field,
) => {
  const settings = state.styles.colourSettings[field];

  if (settings?.field) {
    return "field";
  }

  const colourPalettle = colourPaletteForFieldSelector(state, field);

  if (colourPalettle?.bins >= 0) {
    return "gradient";
  }

  return settings?.mode ?? "categorical";
};

export default colourModeForFieldSelector;
