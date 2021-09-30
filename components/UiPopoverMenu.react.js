import classnames from "classnames";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import PropTypes from "prop-types";
import React from "react";

import "../css/ui-popover-menu.css";
import { getContainerElement } from "../utils/html";
import { emptyObject } from "../constants";

class UiPopoverMenu extends React.PureComponent {

  state = {
    isOpen: false,
  }

  anchorEl = React.createRef();

  open = () => {
    if (this.props.onOpen) {
      this.props.onOpen(this);
    }
    this.setState({ isOpen: true });
  }

  close = () => {
    if (this.props.onClose) {
      this.props.onClose(this);
    }
    this.setState({ isOpen: false });
  }

  render() {
    const { props } = this;

    return (
      <React.Fragment>
        {
          React.createElement(
            props.button,
            {
              ...props.buttonProps,
              onClick: this.open,
              ref: this.anchorEl,
              className: classnames(
                props.buttonProps.className,
                { "is-open": this.state.isOpen },
              ),
            },
          )
        }

        <Popover
          anchorEl={this.anchorEl.current}
          anchorOrigin={
            {
              vertical: "bottom",
              horizontal: props.direction,
            }
          }
          container={getContainerElement}
          onClose={this.close}
          open={this.state.isOpen}
          PaperProps={
            {
              className: classnames(
                props.className,
                "mr-ui-popover-menu"
              ),
            }
          }
          transformOrigin={
            {
              vertical: "top",
              horizontal: props.direction,
            }
          }
        >
          {
            !props.disableHeader && props.title && (
              <header className="mr-header">
                { props.title }
              </header>
            )
          }

          {
            !props.disableCloseButton && (
              <IconButton
                className="mr-floating-action-buttons"
                onClick={this.close}
                size="small"
                title="Close menu"
              >
                <CloseRoundedIcon />
              </IconButton>
            )
          }

          <div
            className="mr-ui-popover-click-trap"
            onClick={props.hideOnClick ? this.close : undefined}
          >
            { (this.state.isOpen) ? props.children : null }
            { (this.state.isOpen && props.content) ? React.createElement(props.content) : null }
          </div>
        </Popover>
      </React.Fragment>
    );
  }

}

UiPopoverMenu.propTypes = {
  button: PropTypes.elementType,
  content: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
  direction: PropTypes.oneOf([
    "left",
    "right",
  ]).isRequired,
  disableCloseButton: PropTypes.bool,
  disableHeader: PropTypes.bool,
  hideOnClick: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  tagName: PropTypes.elementType,
  title: PropTypes.string,
};

UiPopoverMenu.defaultProps = {
  button: "button",
  buttonProps: emptyObject,
  direction: "right",
};

export default UiPopoverMenu;
