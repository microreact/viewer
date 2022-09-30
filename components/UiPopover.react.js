import classnames from "classnames";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import PropTypes from "prop-types";
import React from "react";

// import "../styles/ui-popover-menu.css";
import { getContainerElement } from "../utils/html";

class UiPopover extends React.PureComponent {

  render() {
    const { props } = this;

    return (
      <Popover
        anchorEl={props.anchorEl}
        anchorOrigin={
          {
            vertical: "bottom",
            horizontal: this.props.direction,
          }
        }
        container={getContainerElement}
        onClose={props.onClose}
        open={props.isOpen}
        PaperProps={
          {
            className: classnames(
              this.props.className,
              "mr-ui-popover-menu"
            ),
          }
        }
        transformOrigin={
          {
            vertical: "top",
            horizontal: this.props.direction,
          }
        }
      >
        <div
          onClick={this.props.hideOnClick ? this.close : undefined}
        >
          { this.props.children }
        </div>
      </Popover>
    );
  }

}

UiPopover.propTypes = {
  buttonProps: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  direction: PropTypes.oneOf([
    "left",
    "right",
  ]).isRequired,
  hideOnClick: PropTypes.bool,
  enableCloseButton: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  tagName: PropTypes.elementType,
};

UiPopover.defaultProps = {
  direction: "left",
  hideOnClick: true,
};

export default UiPopover;
