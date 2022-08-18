import { createKeyedStateSelector } from "../../utils/state";

import edgeAttributesSelector from "./edge-attributes";

const lineStylePostfix = /^(.*)__(linestyle)$/i;

const edgeLineStyleAttributesSelector = createKeyedStateSelector(
  (state, networkId) => edgeAttributesSelector(state, networkId),
  (
    fields,
  ) => {
    return fields.filter((attribute) => lineStylePostfix.test(attribute.name));
  },
);

export default edgeLineStyleAttributesSelector;
