import fullDatasetSelector from "./full-dataset.js";

const isEmptySelector = (state) => !fullDatasetSelector(state);

export default isEmptySelector;
