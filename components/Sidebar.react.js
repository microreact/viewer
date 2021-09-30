import "../css/appbar.css";

import React from "react";
import PropTypes from "prop-types";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";

export default function Appbar(props) {

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={props.isOpen}
    >
      <div className="">
        <IconButton onClick={this.handleDrawerClose}>
          <ChevronRightIcon />
        </IconButton>
      </div>
      <div className="">
        test
      </div>
    </Drawer>
  );
}

Appbar.displayName = "Viewer";

Appbar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

Appbar.defaultProps = {
  isOpen: false,
};
