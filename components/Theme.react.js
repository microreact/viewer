import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createSelector } from "reselect";
import CssBaseline from "@mui/material/CssBaseline";
import PropTypes from "prop-types";
import React from "react";

import defaults from "../defaults";
import { ThemeDef } from "../utils/prop-types";

class Theme extends React.PureComponent {

  themeSelector = createSelector(
    (props) => props.theme,
    (theme) => {
      const muiTheme = createTheme({
        palette: {
          text: {
            primary: theme.text.primary,
            secondary: theme.text.secondary,
            disabled: theme.text.disabled,
            hint: theme.text.hint,
          },
          primary: {
            light: theme.primary.light,
            main: theme.primary.main,
            dark: theme.primary.dark,
            contrastText: theme.primary.contrast,
          },
          secondary: {
            light: theme.secondary.light,
            main: theme.secondary.main,
            dark: theme.secondary.dark,
            contrastText: theme.secondary.contrast,
          },
        },
        typography: {
          fontFamily: theme.fonts.body,
          h1: { fontFamily: theme.fonts.headline },
          h2: { fontFamily: theme.fonts.headline },
          h3: { fontFamily: theme.fonts.headline },
          h4: { fontFamily: theme.fonts.headline },
          h5: { fontFamily: theme.fonts.headline },
          h6: { fontFamily: theme.fonts.headline },
          subtitle1: { fontFamily: theme.fonts.headline },
          subtitle2: { fontFamily: theme.fonts.headline },
        },
      });
      const style = {
        "--primary-light": theme.primary.light,
        "--primary-main": theme.primary.main,
        "--primary-dark": theme.primary.dark,
        "--primary-contrast": theme.primary.contrast,
        "--secondary-main": theme.secondary.main,
        "--secondary-contrast": theme.secondary.contrast,
        "--text-primary": theme.text.primary,
        "--text-secondary": theme.text.secondary,
        "--text-disabled": theme.text.disabled,
        "--text-hint": theme.text.hint,
        "--background-main": theme.background.main,
        "--background-highlight": theme.background.highlight,
        "--background-hover": theme.background.hover,
        "--background-disabled": theme.background.disabled,
      };
      return {
        muiTheme,
        style,
      };
    },
  );

  render() {
    const { props } = this;

    const { muiTheme, style } = this.themeSelector(props);

    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div style={style}>
          { props.children }
        </div>
      </ThemeProvider>
    );
  }

}

Theme.displayName = "Theme";

Theme.propTypes = {
  children: PropTypes.node,
  theme: ThemeDef,
};

Theme.defaultProps = {
  theme: defaults.theme,
};

export default Theme;
