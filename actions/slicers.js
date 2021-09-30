export const addSlicer = (paneId, title) => {
  return {
    type: "MICROREACT VIEWER/ADD SLICER",
    payload: {
      paneId,
      title: title || "Slicer",
    },
  };
};

export function removeSlicer(paneId) {
  return {
    delay: true,
    group: `${paneId}/remove`,
    label: "Slicer: Remove Slicer",
    payload: {
      paneId,
    },
    type: "MICROREACT VIEWER/REMOVE SLICER",
  };
}

export const update = (slicerId, key, value) => ({
  type: "MICROREACT VIEWER/UPDATE SLICER",
  slicerId,
  payload: { [key]: value },
  label:
    (key === "field") ? `Slicer: Set column to ${value}` :
      (key === "chartType") ? `Slicer: Set chart type to ${value}` :
        undefined,
  delay: true,
});
