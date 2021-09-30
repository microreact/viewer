export const update = (chartId, key, value) => ({
  type: "MICROREACT VIEWER/UPDATE META",
  chartId,
  payload: { [key]: value },
});
