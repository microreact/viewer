/* eslint-disable no-unused-expressions */
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Menu from "@material-ui/core/Menu";
import Popover from "@material-ui/core/Popover";

import "../css/ui-context-menu.css";
import { getContainerElement } from "../utils/html";

class UiContextMenu extends React.PureComponent {

  state = {
    point: undefined,
  }

  handleClick = (event) => {
    event.preventDefault();
    this.setState({
      point: {
        left: event.clientX,
        top: event.clientY,
      },
    });
  };

  handleClose = () => {
    this.setState({ point: undefined });
    this.props.onClose && this.props.onClose();
  };

  render() {
    const { props } = this;

    const isOpened = (this.state.point !== undefined);

    return (
      // <div
      //   onContextMenu={this.handleClick}
      //   // ref={props.forwardRef}
      // >
        <Popover
          // anchorEl={this.anchorEl.current}
          // anchorOrigin={
          //   {
          //     vertical: "bottom",
          //     horizontal: this.props.direction,
          //   }
          // }
          container={getContainerElement}
          onClose={this.handleClose}
          open={isOpened}
          PaperProps={
            {
              className: classnames(
                this.props.className,
                "mr-ui-context-menu"
              ),
              elevation: 0,
              square: true,
            }
          }
          // transformOrigin={
          //   {
          //     vertical: "top",
          //     horizontal: this.props.direction,
          //   }
          // }
        >
          { isOpened && props.renderMenu(this.state.point) }
        </Popover>
      // {/* <Menu
      //   container={getContainerElement}
      //   PaperProps={
      //     {
      //       className: classnames(
      //         this.props.className,
      //         "mr-ui-context-menu"
      //       ),
      //       // elevation: false,
      //       square: true,
      //     }
      //   }
      //   elevation={0}
      //   keepMounted
      //   open={this.state.point !== undefined}
      //   onClose={this.handleClose}
      //   anchorReference="anchorPosition"
      //   anchorPosition={this.state.point}
      // >
      //   { (this.state.point !== undefined) && props.renderMenu(this.state.point) }
      // </Menu> */}
      // { props.children }
      // </div>
    );
  }

}

UiContextMenu.displayName = "UiContextMenu";

UiContextMenu.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  forwardRef: PropTypes.object,
  renderMenu: PropTypes.func.isRequired,
};

export default UiContextMenu;
