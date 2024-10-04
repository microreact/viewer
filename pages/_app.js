/* eslint-disable react/prop-types */

import React from "react";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { ThemeProvider } from "@mui/material/styles";

import { muiTheme } from "../dev/theme.js";

import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";

import "../styles/index.css";

function MyApp(props) {
  const { Component, pageProps } = props;
  return (
    <AppCacheProvider {...props}>
      {/* <ThemeProvider theme={muiTheme}> */}
        <Component {...pageProps} />
      {/* </ThemeProvider> */}
    </AppCacheProvider>
  );
}

export default MyApp;
