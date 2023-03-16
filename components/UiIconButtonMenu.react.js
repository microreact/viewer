/* eslint-disable class-methods-use-this */

import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import React from "react";

import UiPopoverMenu from "./UiPopoverMenu.react";

const UiIconButtonMenu = React.memo(
  (props) => {
    const { icon, title, content, className, menuClassName, ...rest } = props;
    return (
      <UiPopoverMenu
        {...rest}
        className={menuClassName}
        button={IconButton}
        buttonProps={
          {
            children: icon,
            className,
            color: "inherit",
            size: "small",
            title,
          }
        }
        title={title}
        content={content}
      />
    );
  }
);

UiIconButtonMenu.displayName = "UiIconButtonMenu";

UiIconButtonMenu.propTypes = {
  menuClassName: PropTypes.string,
  className: PropTypes.string,
  content: PropTypes.elementType,
  icon: PropTypes.element,
  title: PropTypes.string,
};

export default UiIconButtonMenu;
