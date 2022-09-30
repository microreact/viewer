/* eslint-disable react/prop-types */

import React from "react";
import "../src/styles/index.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
