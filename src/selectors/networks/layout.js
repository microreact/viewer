import { createKeyedStateSelector } from "../../utils/state";

import originalLayoutSelector from "./original-layout";

const layoutSelector = createKeyedStateSelector(
  (state, networkId) => state.networks[networkId].layout,
  (state, networkId) => originalLayoutSelector(state, networkId),
  // getGeographicLayout,
  (
    currentLayout,
    originalLayout,
    geographicLayout,
  ) => {
    if (geographicLayout) {
      return geographicLayout;
    }

    if (currentLayout) {
      return currentLayout;
    }

    if (originalLayout) {
      return originalLayout;
    }

    return null;
  },
);

export default layoutSelector;
