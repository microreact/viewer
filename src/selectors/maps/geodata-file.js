import fileDescriptorSelector from "../files/file-descriptor";
import mapStateSelector from "./map-state";

function geodataFileSelector(state, networkId) {
  return fileDescriptorSelector(
    state,
    mapStateSelector(state, networkId)?.geodata?.file,
  );
}

export default geodataFileSelector;
