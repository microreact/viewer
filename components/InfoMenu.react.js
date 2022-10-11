/* eslint-disable class-methods-use-this */

import { createSelector } from "reselect";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";

import UiDropdownMenu from "./UiDropdownMenu.react";

const MenuIcon = <InfoTwoToneIcon />;

class DownloadFilesMenu extends React.PureComponent {

  filesSelector = createSelector(
    (props) => props.files,
    (filesState) => {
      const items = [];

      for (const file of Object.values(filesState)) {
        items.push({
          ...file,
          label: file.name || `${file.type} file`,
        });
      }

      return items;
    }
  );

  render() {
    const { props } = this;

    return (
      <UiDropdownMenu
        button={IconButton}
        buttonProps={
          {
            color: "inherit",
            size: "small",
            title: "Project Info",
            children: MenuIcon,
          }
        }
      >
        <div
          className="mr-content"
          style={{ maxWidth: 400 }}
        >
          <Typography
            component="h2"
            variant="h6"
            color="primary"
          >
            About Project
          </Typography>
          <Typography
            component="h3"
            variant="subtitle1"
            color="primary"
          >
            { props.name }
          </Typography>

          <ReactMarkdown>
            { props.description || "(no description)" }
          </ReactMarkdown>

          {
            (props.createdAt) && (
              <p>
                Created: <time dateTime={props.createdAt} >{(new Date(props.createdAt)).toLocaleString()}</time>
              </p>
            )
          }

          {
            (props.updatedAt) && (
              <p>
                Updated: <time dateTime={props.updatedAt} >{(new Date(props.updatedAt)).toLocaleString()}</time>
              </p>
            )
          }

          {
            (props.email) && (
              <p>
                <a
                  href={`mailto:${props.email}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  { props.email }
                </a>
              </p>
            )
          }

          {
            (props.website) && (
              <p>
                <a
                  href={props.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  { props.website }
                </a>
              </p>
            )
          }
        </div>
    </UiDropdownMenu>
    );
  }

}

DownloadFilesMenu.displayName = "DownloadFilesMenu";

DownloadFilesMenu.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  email: PropTypes.string,
  website: PropTypes.string,
};

export default DownloadFilesMenu;
