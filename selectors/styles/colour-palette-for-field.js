import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import colourPalettesSelector from "./colour-palettes";

/**
 * Returns the colour palette used for a field
 */
const colourPaletteForFieldSelector = (
  state,
  field,
) => {
  let sourceFieldName = field;

  if (state.styles.colourSettings[field]?.field) {
    sourceFieldName = state.styles.colourSettings[field].field;
  }

  const settings = state.styles.colourSettings[sourceFieldName];

  const colourPalettes = colourPalettesSelector(state);

  if (settings?.palette) {
    const palette = colourPalettes.find((x) => x.name === settings.palette);
    if (palette) {
      return palette;
    }
  }

  const sourceDataColumn = dataColumnByFieldSelector(state, sourceFieldName);

  if (sourceDataColumn?.colourPalette) {
    const palette = colourPalettes.find((x) => x.name === sourceDataColumn.colourPalette);
    if (palette) {
      return palette;
    }
  }

  return colourPalettes.find((x) => x.name === "microreact colour palette");
};

export default colourPaletteForFieldSelector;
