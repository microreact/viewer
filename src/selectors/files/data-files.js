const dataFilesSelector = (
  (state) => Object.values(state.files).filter((x) => x.type === "data")
);

export default dataFilesSelector;
