import React from "react";
import { Provider } from "react-redux";

import store from "../store.js";

import Viewer from "../containers/Viewer.react.js";

function ViewerWithProvider(props) {
  return (
    <Provider store={store}>
      <Viewer {...props} />
    </Provider>
  );
}

ViewerWithProvider.displayName = "ViewerWithProvider";

export default ViewerWithProvider;
