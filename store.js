import { applyMiddleware, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";

import reducer from "./reducers";
import delayDispatchMiddleware from "./utils/store-middleware";

const store = compose(
  applyMiddleware(
    thunkMiddleware,
    delayDispatchMiddleware,
  ),
  (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__) ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
)(createStore)(reducer);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept(
    "./reducers",
    () => store.replaceReducer(reducer),
  );
}

export default store;
