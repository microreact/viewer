import { connectToPresentState } from "../utils/state.js";

import MatrixPane from "../components/MatrixPane.js";

function mapDispatchToProps(dispatch, { matrixId }) {
  return {
  };
}

export default connectToPresentState(
  MatrixPane,
  null,
  mapDispatchToProps,
);
