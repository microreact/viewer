import { Provider } from "react-redux";
import React from "react";

import MicroreactViewer, { store, actions } from "./viewer";

import projectJson from "./dev/-debug.json";

class Viewer extends React.PureComponent {

  state = {
    ready: null,
  };

  componentDidMount() {
    projectJson.config = {
      mapboxApiAccessToken: "pk.eyJ1IjoiY2dwc2Rldi1hbXJ3YXRjaCIsImEiOiJjbDZvd2d0cXMwMHBsM2Ntdmw1N3hrcG01In0.Epc_uol4lu4FtlHdJ0i2Hw",
    };
    store.dispatch(actions.load(projectJson));
    this.setState({ ready: true });
  }

  render() {
    return (
      <Provider store={store}>
        <MicroreactViewer
          disableThemeProvider
        >
        </MicroreactViewer>
      </Provider>
    );
  }

}

export default Viewer;
