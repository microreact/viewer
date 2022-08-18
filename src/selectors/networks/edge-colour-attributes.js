import { createKeyedStateSelector } from "../../utils/state";

import edgeAttributesSelector from "./edge-attributes";

const colourPostfix = /^(.*)__(colour|color)$/i;

const edgeColourAttributesSelector = createKeyedStateSelector(
  (state, networkId) => edgeAttributesSelector(state, networkId),
  (
    fields,
  ) => {
    return fields.filter((attribute) => colourPostfix.test(attribute.name));
  },
);

export default edgeColourAttributesSelector;
