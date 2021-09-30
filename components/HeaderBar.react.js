import AppBar from "@material-ui/core/AppBar";
import PropTypes from "prop-types";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import "../css/header-bar.css";

import AddPaneMenu from "../containers/AddPaneMenu.react";
import DownloadFilesMenuButton from "./DownloadFilesMenuButton.react";
import InfoMenu from "../containers/InfoMenu.react";
import SearchBox from "../containers/SearchBox.react";
import StylesMenu from "./StylesMenu.react";

class HeaderBar extends React.PureComponent {

  render() {
    const { props } = this;

    return (
      <AppBar
        className="mr-header-bar"
        position="static"
      >
        <Toolbar variant="dense">
          { props.drawerButton }

          <Typography component="h1" variant="h6" color="inherit" noWrap style={{ flexGrow: 1 }}>
            { props.title }

            <InfoMenu />

            { props.prependNavButtons }

          </Typography>

          <SearchBox />

          <nav>
            {
              (!props.readOnly) && <AddPaneMenu />
            }

            <StylesMenu />

            &nbsp;

            <DownloadFilesMenuButton />

            &nbsp;

            {
              props.appendNavButtons
            }
          </nav>
        </Toolbar>
      </AppBar>
    );
  }

}

HeaderBar.displayName = "HeaderBar";

HeaderBar.propTypes = {
  appendNavButtons: PropTypes.node,
  drawerButton: PropTypes.node,
  onSave: PropTypes.func,
  onToggleHistoryPane: PropTypes.func.isRequired,
  onToggleStylesPane: PropTypes.func.isRequired,
  onToggleViewsPane: PropTypes.func.isRequired,
  prependNavButtons: PropTypes.node,
  readOnly: PropTypes.bool.isRequired,
  title: PropTypes.string,
};

HeaderBar.defaultProps = {
  appendNavButtons: false,
  drawerButton: false,
  prependNavButtons: false,
  title: "Microreact",
};

export default HeaderBar;
