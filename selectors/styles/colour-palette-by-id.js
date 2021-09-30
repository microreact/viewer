import colourPalettesSelector from "./colour-palettes";

/**
 * Returns the colour palette identified by its unique ID
 */
const colourPaletteByIdSelector = (
  state,
  colourPaletteId,
) => {
  const colourPalettes = colourPalettesSelector(state);

  const palette = colourPalettes.find((x) => x.name === colourPaletteId);

  return palette;
};

export default colourPaletteByIdSelector;
