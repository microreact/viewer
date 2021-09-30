import { createKeyedStateSelector } from "../../utils/state";

import edgeAttributesSelector, { anyPostfix } from "./edge-attributes";

const edgeLabelAttributesSelector = createKeyedStateSelector(
  (state, networkId) => edgeAttributesSelector(state, networkId),
  (
    fields,
  ) => {
    return fields.filter((attribute) => !anyPostfix.test(attribute.name));
  },
);

export default edgeLabelAttributesSelector;
