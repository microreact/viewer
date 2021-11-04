import PropTypes from "prop-types";
import React from "react";

import PaneIcon from "./PaneIcon.react";
import StylesMenuContent from "../containers/StylesMenuContent.react";
import UiIconButtonMenu from "./UiIconButtonMenu.react";

const StylesPaneIcon = <PaneIcon component="Styles" />;

const StylesMenu = React.memo(
  () => {
    return (
      <UiIconButtonMenu
        content={StylesMenuContent}
        disableCloseButton
        disableHeader
        hideOnClick={false}
        icon={StylesPaneIcon}
        title="Labels, Colours, and Shapes"
      />
    );
  }
);

StylesMenu.displayName = "StylesMenu";

StylesMenu.propTypes = {
  files: PropTypes.object,
};

export default StylesMenu;
