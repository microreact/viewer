/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */

import { Provider } from "react-redux";
import React from "react";
import { fetchFile } from "@loaders.gl/core";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import MicroreactViewer, { Theme, store, actions } from "../index";
import { setFetcher } from "../utils/proxy";

setFetcher(async (originalUrl) => {
  if (typeof originalUrl !== "string") {
    return fetchFile(originalUrl);
  }

  let url = originalUrl;
  if (url.startsWith("microreact://")) {
    url = `/api/files/raw?${url.substr(13)}`;
  }
  // if (url.startsWith("/")) {
  //   url = `https://microreact.org${url}`;
  // }

  try {
    console.debug("fetching file", url);
    const content = await fetch(url);
    return content;
  }
  catch (error) {
    if (error instanceof TypeError) {
      console.debug("direct fetch failed, will try via proxy");
      const content = fetch(`/api/files/proxy?url=${encodeURIComponent(url)}`);
      return content;
    }
    else {
      throw error;
    }
  }
});

const defaultConfig = {
  mapboxApiAccessToken: "pk.eyJ1IjoiY2dwc2Rldi1hbXJ3YXRjaCIsImEiOiJjbDZvd2d0cXMwMHBsM2Ntdmw1N3hrcG01In0.Epc_uol4lu4FtlHdJ0i2Hw",
};

class App extends React.PureComponent {

  state = {
    ready: null,
  };

  componentDidMount() {
    const { props } = this;
    if (props.data) {
      props.data.config = defaultConfig;
      store.dispatch(actions.load(props.data));
      this.setState({ ready: true });
    }
    else {
      store.dispatch(
        actions.config(defaultConfig)
      );
      if (props.files) {
        store.dispatch(
          actions.addFiles(props.files)
        );
      }
      this.setState({ ready: true });
    }
  }

  renderViewerComponents = () => {
    return {
      drawerButton: (
        <IconButton
          edge="start"
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
      ),
      appendNavButtons: (
        <React.Fragment>
          <IconButton
            edge="start"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </React.Fragment>
      ),
    };
  };

  render() {
    return (
      <Provider store={store}>
        <Theme>
          <MicroreactViewer
            components={this.renderViewerComponents()}
          />
        </Theme>
      </Provider>
    );
  }

}

export default App;
