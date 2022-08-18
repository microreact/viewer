import React from "react";
import ReactDOM from "react-dom";
import { fetchFile } from "@loaders.gl/core";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { setFetcher } from "./utils/proxy";

import projectJson from "./dev/debug.json";

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
    console.log("fetching file", url);
    const content = await fetch(url);
    return content;
  }
  catch (error) {
    if (error instanceof TypeError) {
      console.debug("direct fetch failed, will try via proxy");
      const content = fetch(`/proxy?url=${encodeURIComponent(url)}`);
      return content;
    }
    else {
      throw error;
    }
  }
});

ReactDOM.render(
  (
    <React.StrictMode>
      <App
        data={projectJson}
      />
    </React.StrictMode>
  ),
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
