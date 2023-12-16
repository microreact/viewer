/* eslint-disable react/prop-types */

import React from "react";

import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/700.css";

import "../styles/index.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
