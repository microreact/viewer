/* eslint-disable react/prop-types */

import React from "react";
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';

// import "@fontsource/space-grotesk/400.css";
// import "@fontsource/space-grotesk/700.css";
// import "@fontsource/work-sans/400.css";
// import "@fontsource/work-sans/700.css";

import "../styles/index.css";

function MyApp(props) {
  const { Component, pageProps } = props;
  return (
    <AppCacheProvider {...props}>
      <Component {...pageProps} />
    </AppCacheProvider>
  )
}

export default MyApp;
