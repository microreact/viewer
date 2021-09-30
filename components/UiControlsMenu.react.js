import ArrowDropDownTwoToneIcon from "@material-ui/icons/ArrowDropDownTwoTone";
import Chip from "@material-ui/core/Chip";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "../css/controls-menu.css";
import UiPopoverMenu from "./UiPopoverMenu.react";

class UiControlsMenu extends React.PureComponent {

  menuRef = React.createRef();

  open = () => {
    this.menuRef.current.open();
  }

  close = () => {
    this.menuRef.current.close();
  }

  popoverMenuButtonProps = () => {
    const { props } = this;

    return {
      className: classnames(
        "mr-controls-menu-trigger",
        props.className,
      ),
      icon: <ArrowDropDownTwoToneIcon />,
      label: props.summary || props.title,
      // onClick: () => this.menuRef.current.open(),
      onDelete: props.onClear || undefined,
      size: "small",
      // variant: "outlined",
      color: (props.onClear ? "primary" : undefined),
      style: props.style,
    };
  }

  render() {
    const { props } = this;

    return (
      <UiPopoverMenu
        button={Chip}
        buttonProps={this.popoverMenuButtonProps()}
        className={
          classnames(
            "mr-controls-menu",
            // { "mr-fixed-size": props.fixedSize },
            props.className
          )
        }
        direction="right"
        // hideOnClick={props.hideOnClick}
        disableCloseButton={props.disableHeader}
        disableHeader={props.disableHeader}
        onClose={props.onClose}
        onOpen={props.onOpen}
        ref={this.menuRef}
        title={props.title}
      >
        { props.children }
      </UiPopoverMenu>
    );
  }

}

UiControlsMenu.displayName = "ControlsMenu";

UiControlsMenu.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disableHeader: PropTypes.bool,
  fixedSize: PropTypes.bool,
  hideOnClick: PropTypes.bool,
  onClear: PropTypes.oneOfType([
    PropTypes.oneOf([ false ]),
    PropTypes.func,
  ]),
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  style: PropTypes.object,
  summary: PropTypes.node,
  title: PropTypes.node.isRequired,
};

export default UiControlsMenu;
