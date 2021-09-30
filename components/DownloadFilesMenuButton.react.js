/* eslint-disable class-methods-use-this */

import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";

import UiDropdownMenu from "./UiDropdownMenu.react";
import DownloadFilesMenuContent from "../containers/DownloadFilesMenuContent.react";

const Icon = <GetAppRoundedIcon />;

const DownloadFilesMenuButton = React.memo(
  () => {
    return (
      <UiDropdownMenu
        button={IconButton}
        buttonProps={
          {
            color: "inherit",
            size: "small",
            title: "Download Project Files",
            children: Icon,
          }
        }
      >
        <DownloadFilesMenuContent />
      </UiDropdownMenu>
    );
  }
);

DownloadFilesMenuButton.displayName = "DownloadFilesMenuButton";

DownloadFilesMenuButton.propTypes = {
  files: PropTypes.object,
};

export default DownloadFilesMenuButton;
