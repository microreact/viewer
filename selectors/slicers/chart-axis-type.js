import { dataFieldToAxisType } from "../../utils/charts";
import dataColumnSelector from "./data-column";
import slicerStateSelector from "./slicer-state";

function chartAxisTypeSelector(state, slicerId) {
  const { chartAxisType } = slicerStateSelector(state, slicerId);
  if (!chartAxisType || chartAxisType === "auto") {
    const dataColumn = dataColumnSelector(state, slicerId);
    return dataFieldToAxisType(dataColumn);
  }
  else {
    return chartAxisType;
  }
}

export default chartAxisTypeSelector;
