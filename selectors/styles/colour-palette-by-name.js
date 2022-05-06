import colourPalettesSelector from "./colour-palettes";

const colourPaletteByNameSelector = (
  (state, paletteName) => colourPalettesSelector(state).find((x) => x.name === paletteName)
);

export default colourPaletteByNameSelector;
