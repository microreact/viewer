import { createKeyedStateSelector } from "../../utils/state";

import layoutModelSelector from "./layout-model";

const paneWidthSelector = (state, paneId) => {
  const model = layoutModelSelector(state);
  const node = model.getNodeById(paneId);
  return node._rect.width;
};

const paneHeightSelector = (state, paneId) => {
  const model = layoutModelSelector(state);
  const node = model.getNodeById(paneId);
  return node._rect.height;
};

const paneSizeSelector = createKeyedStateSelector(
  (state, paneId) => paneWidthSelector(state, paneId),
  (state, paneId) => paneHeightSelector(state, paneId),
  (
    width,
    height,
  ) => {
    return {
      width,
      height,
    };
  },
);

export default paneSizeSelector;
