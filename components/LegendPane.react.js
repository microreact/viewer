import clsx from "clsx";
import Divider from "@mui/material/Divider";
import htmlToSvg from "htmlsvg";
import ListSubheader from "@mui/material/ListSubheader";
import PropTypes from "prop-types";
import React from "react";

// import "../styles/legend-pane.css";

import UiDropdownMenu from "./UiDropdownMenu.react";
import UiIconButton from "./UiIconButton.react";

import { icons } from "../constants";
import LegendsList from "./LegendsList.react";
import { exportHtmlElementAsDataUrl } from "../utils/html";
import { downloadDataUrl } from "../utils/downloads";
import UiSidePaneHeader from "./UiSidePaneHeader.react";

class LegendPane extends React.PureComponent {

  elRef = React.createRef()

  downloadSvg = async (legendId) => {
    const htmlElement = this.elRef.current.querySelector(`[id="${legendId}"]`);
    await htmlToSvg(
      htmlElement,
      {
        downloadSvg: true,
        downloadPng: false,
        convertDataUrl: false, // you need to convert images to dataurl if you wanna download png image
        filename: legendId,
      },
    );
  }

  downloadPng = (legendId,) => {
    const htmlElement = this.elRef.current.querySelector(`[id="${legendId}"]`);
    exportHtmlElementAsDataUrl(htmlElement)
      .then((url) =>
        downloadDataUrl(
          url,
          "legend.png",
          "image/png",
        )
      );
  }

  renderExportMenu() {
    const { props } = this;
    return (
      <UiDropdownMenu
        button={UiIconButton}
        icon={icons.menu}
      >
        {
          (props.legends.length > 1) && (
            <UiDropdownMenu.Item
              onClick={() => props.onDirectionChange((props.direction === "row") ? "column" : "row")}
            >
              {
                (props.direction === "row") ? "Stack Vertically" : "Stack Horizontally"
              }
            </UiDropdownMenu.Item>
          )
        }
        {
          (props.legends.length > 1) && (<Divider />)
        }

        <ListSubheader>Download as SVG</ListSubheader>

        {
          props.legends.map(
            (item) => {
              return (
                <UiDropdownMenu.Item
                  key={item.id}
                  onClick={() => this.downloadSvg(item.id)}
                >
                  { item.title }
                </UiDropdownMenu.Item>
              );
            }
          )
        }

        <Divider />

        <ListSubheader>Download as PNG</ListSubheader>

        {
          props.legends.map(
            (item) => {
              return (
                <UiDropdownMenu.Item
                  key={item.id}
                  onClick={() => this.downloadPng(item.id)}
                >
                  { item.title }
                </UiDropdownMenu.Item>
              );
            }
          )
        }
      </UiDropdownMenu>
    );
  }

  render() {
    const { props } = this;

    return (
      <div className="mr-legend-pane">
        <UiSidePaneHeader
          disableSticky
          onClose={props.onClose}
          title="Legend"
        >
          { this.renderExportMenu() }
        </UiSidePaneHeader>

        <div
          className={
            clsx(
              "mr-legends",
              (props.direction === "row") ? "mr-stack-horizontally" : "mr-stack-vertically",
            )
          }
          ref={this.elRef}
        >
          <LegendsList
            legends={props.legends}
          />
        </div>
      </div>
    );
  }

}

LegendPane.displayName = "Legend";

LegendPane.propTypes = {
  direction: PropTypes.string.isRequired,
  legends: PropTypes.array.isRequired,
  onDirectionChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LegendPane;
