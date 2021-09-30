import fullDatasetSelector from "./full-dataset";

const rowsSelector = (
  (state) => fullDatasetSelector(state)?.rows
);

export default rowsSelector;
