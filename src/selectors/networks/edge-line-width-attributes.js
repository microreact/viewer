import { createKeyedStateSelector } from "../../utils/state";

import edgeAttributesSelector from "./edge-attributes";

const lineWidthPostfix = /^(.*)__(linewidth)$/i;

const edgeLineWidthAttributesSelector = createKeyedStateSelector(
  (state, networkId) => edgeAttributesSelector(state, networkId),
  (
    fields,
  ) => {
    return fields.filter((attribute) => lineWidthPostfix.test(attribute.name));
  },
);
export default edgeLineWidthAttributesSelector;
