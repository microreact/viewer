/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */

import { Provider } from "react-redux";
import React from "react";
import { fetchFile } from "@loaders.gl/core";

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
      data.config = defaultConfig;
      store.dispatch(actions.load(data));
      this.setState({ ready: true });
    }
    else {
      store.dispatch(
        actions.config(defaultConfig)
      );
      if (props.files) {
        store.dispatch(
          addFiles(props.files)
        );
      }
      this.setState({ ready: true });
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Theme>
          <MicroreactViewer>
          </MicroreactViewer>
        </Theme>
      </Provider>
    );
  }

}

export default App;
