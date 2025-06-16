import { sum } from "d3-array";
import rowsSelector from "./rows";

const numberOfRowsSelector = (state) => {
  const rows = rowsSelector(state);
  if (rows) {
    return sum(
      rows,
      (x) => x["--mr-scalar"] ?? 1,
    );
  }
  return 0;
};

export default numberOfRowsSelector;
