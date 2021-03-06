/* eslint-disable class-methods-use-this */

import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";

import UiPopoverMenu from "./UiPopoverMenu.react";

const UiIconButtonMenu = React.memo(
  (props) => {
    const { icon, title, content, ...rest } = props;
    return (
      <UiPopoverMenu
        {...rest}
        button={IconButton}
        buttonProps={
          {
            title,
            color: "inherit",
            size: "small",
            children: icon,
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
  content: PropTypes.elementType,
  icon: PropTypes.element,
  title: PropTypes.string,
};

export default UiIconButtonMenu;
