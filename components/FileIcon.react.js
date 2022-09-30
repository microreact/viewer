// import "../styles/file-icon.css";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Badge from "@mui/material/Badge";
import InsertDriveFileTwoToneIcon from "@mui/icons-material/InsertDriveFileTwoTone";

const FileIcon = (props) => (
  <Badge
    badgeContent={props.label}
    className={
      classnames(
        "file-icon",
        props.label
      )
    }
    classes={{ badge: "label" }}
    color="primary"
  >
    <InsertDriveFileTwoToneIcon color="action" />
    {
      props.icon && React.createElement(
        props.icon,
        {
          className: "diacritic",
          color: "action",
        }
      )
    }
  </Badge>
);

FileIcon.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.any,
};

export default FileIcon;
