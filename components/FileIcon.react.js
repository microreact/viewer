import "../css/file-icon.css";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Badge from "@material-ui/core/Badge";
import InsertDriveFileTwoToneIcon from "@material-ui/icons/InsertDriveFileTwoTone";

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
