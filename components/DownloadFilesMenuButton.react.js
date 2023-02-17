/* eslint-disable class-methods-use-this */

import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import IconButton from "@mui/material/IconButton";
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
            className: "mr-download-menu-button",
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
