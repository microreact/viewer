import React from "react";
import PropTypes from "prop-types";
import createTheme from "cgps-stdlib/themes/create-theme.js";
import mr from "cgps-stdlib/themes/mr.js";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const {
  themeStyle,
  muiTheme,
} = createTheme(mr);

function Theme(props) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div style={themeStyle}>
        {props.children}
      </div>
    </ThemeProvider>
  );
}

Theme.propTypes = {
  children: PropTypes.node,
};

export default Theme;
