export const update = (key, value) => ({
  type: "MICROREACT VIEWER/UPDATE META",
  payload: { [key]: value },
});
