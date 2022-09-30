import { Provider } from "react-redux";
import React from "react";
import dynamic from "next/dynamic";

import store from "../src/store";

const MicroreactViewer = dynamic(
  () => import("../src/containers/Viewer.react"),
  {
    ssr: false,
  },
);


export default function Viewer() {
  return (
    <Provider store={store}>
      <MicroreactViewer
        disableThemeProvider
      >
      </MicroreactViewer>
    </Provider>
  )
}
