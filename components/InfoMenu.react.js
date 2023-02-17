/* eslint-disable class-methods-use-this */

import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";

import UiDropdownMenu from "./UiDropdownMenu.react";

const MenuIcon = <InfoTwoToneIcon />;

const buttonProps = {
  children: MenuIcon,
  className: "mr-project-info",
  color: "inherit",
  size: "small",
  title: "Project Info",
};

class InfoMenu extends React.PureComponent {

  render() {
    const { props } = this;

    return (
      <UiDropdownMenu
        button={IconButton}
        buttonProps={buttonProps}
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

InfoMenu.displayName = "InfoMenu";

InfoMenu.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  email: PropTypes.string,
  website: PropTypes.string,
};

export default InfoMenu;
