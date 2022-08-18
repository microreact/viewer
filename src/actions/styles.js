export function addCustomColourPalette(palette) {
  return {
    delay: true,
    label: "Project: Add colour palette",
    type: "MICROREACT VIEWER/ADD CUSTOM COLOUR PALETTE",
    payload: palette,
  };
}

export function addCustomShapePalette(palette) {
  return {
    delay: true,
    label: "Project: Add shape palette",
    type: "MICROREACT VIEWER/ADD CUSTOM SHAPE PALETTE",
    payload: palette,
  };
}

export function setColourByField(field) {
  return {
    delay: true,
    label: `Project: Colour by ${field}`,
    type: "MICROREACT VIEWER/SET COLOUR BY FIELD",
    payload: field,
  };
}

export function setDataColumnColourPalette(field, palette, mode) {
  return {
    delay: true,
    label: `Project: Set colour palette of ${field} to ${palette}`,
    type: "MICROREACT VIEWER/SET COLOUR SETTINGS",
    payload: {
      field,
      settings: {
        palette,
        mode,
      },
    },
  };
}

export function setDataColumnColourField(field, colourField) {
  return {
    delay: true,
    label: `Project: Colour ${field} as ${colourField}`,
    type: "MICROREACT VIEWER/SET COLOUR SETTINGS",
    payload: {
      field,
      settings: { field: colourField },
    },
  };
}

export function setLabelByField(field) {
  return {
    delay: true,
    label: `Project: Label by ${field}`,
    type: "MICROREACT VIEWER/SET LABEL BY FIELD",
    payload: field,
  };
}

export function setShapeByField(field) {
  return {
    delay: true,
    label: field ? `Project: Shape by ${field}` : "Project: Set shapes field to default",
    type: "MICROREACT VIEWER/SET SHAPE BY FIELD",
    payload: field ?? null,
  };
}

export function setDefaultColour(defaultColour) {
  return {
    delay: true,
    label: `Project: Set default colour to ${defaultColour}`,
    type: "MICROREACT VIEWER/SET DEFAULT COLOUR",
    payload: defaultColour,
  };
}

export function setLegendDirection(direction) {
  return {
    delay: true,
    type: "MICROREACT VIEWER/SET LEGEND DIRECTION",
    payload: direction,
  };
}

export function updateColourPalette(palette) {
  return {
    delay: true,
    label: "Project: Update colour palette",
    type: "MICROREACT VIEWER/UPDATE COLOUR PALETTE",
    payload: palette,
  };
}
