import { Provider } from "react-redux";
import React from "react";

import MicroreactViewer, { Theme, store, actions } from "./viewer";

class Viewer extends React.PureComponent {

  state = {
    ready: null,
  };

  componentDidMount() {
    const { data } = this.props;
    data.config = {
      mapboxApiAccessToken: "pk.eyJ1IjoiY2dwc2Rldi1hbXJ3YXRjaCIsImEiOiJjbDZvd2d0cXMwMHBsM2Ntdmw1N3hrcG01In0.Epc_uol4lu4FtlHdJ0i2Hw",
    };
    store.dispatch(actions.load(data));
    this.setState({ ready: true });
  }

  render() {
    return (
      <Provider store={store}>
        <Theme>
          <MicroreactViewer
            disableThemeProvider
          >
          </MicroreactViewer>
        </Theme>
      </Provider>
    );
  }

}

export default Viewer;
