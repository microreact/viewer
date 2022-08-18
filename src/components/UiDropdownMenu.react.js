import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import PropTypes from "prop-types";
import React from "react";
import Button from "@material-ui/core/Button";

import "../css/ui-dropdown-menu.css";
import UiPopoverMenu from "./UiPopoverMenu.react";

const UiDropdownMenu = React.memo(
  (props) => {
    return (
      <UiPopoverMenu
        button={props.button ?? Button}
        buttonProps={{
          children: props.icon,
          size: "small",
          variant: "contained",
          title: props.title,
          className: props.className,
          style: props.style,
          ...props.buttonProps,
        }}
        className="mr-ui-dropdown-menu"
        direction="right"
        disableCloseButton
        hideOnClick={props.hideOnClick}
      >
        <MenuList
          className="mr-ui-dropdown-menu"
        >
          { props.children }
        </MenuList>
      </UiPopoverMenu>
    );
  }
);

UiDropdownMenu.displayName = "UiDropdownMenu";

UiDropdownMenu.propTypes = {
  button: PropTypes.elementType,
  icon: PropTypes.element,
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  hideOnClick: PropTypes.bool,
};

UiDropdownMenu.defaultProps = {
  hideOnClick: true,
};

UiDropdownMenu.Item = MenuItem;

export default UiDropdownMenu;
