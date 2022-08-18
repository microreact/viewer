import fileDescriptorSelector from "../files/file-descriptor";
import networkStateSelector from "./network-state";

function networkFileSelector(state, networkId) {
  return fileDescriptorSelector(
    state,
    networkStateSelector(state, networkId)?.file,
  );
}

export default networkFileSelector;
