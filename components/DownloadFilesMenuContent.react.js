import PropTypes from "prop-types";
import React from "react";

import UiDropdownMenu from "./UiDropdownMenu.react";
import PaneIcon from "./PaneIcon.react";

import { downloadDataUrl } from "../utils/downloads";
import { normaliseFilename } from "../utils/files";

const icons = {
  data: "Table",
  network: "Network",
  tree: "Tree",
  geo: "Map",
};

const extensions = {
  "text/csv": "csv",
  "application/x-speadsheet": "xlsx",
  "text/x-nh": "nwk",
  "text/vnd.graphviz": "dot",
  "application/geo+json": "geojson",
  "text/markdown": "md",
};

function normmaliseUrl(url) {
  if (typeof url === "string") {
    return url.replace("https://beta.microreact.org/", "https://microreact.org/");
  }
  else {
    return url;
  }
}

function normmaliseDownload(item) {
  if (item.name) {
    return normaliseFilename(item.name);
  }
  else {
    const extension = extensions[item.format];
    return `${item.type}.${extension}`;
  }
}

class DownloadFilesMenuContent extends React.PureComponent {

  filesSelector() {
    const { props } = this;
    return Object.values(props.files);
  }

  render() {
    return (
      this.filesSelector().map(
        (item) => {
          const normmalisedUrl = normmaliseUrl(item.url);
          return (
            <UiDropdownMenu.Item
              key={item.id}
              alignItems="flex-start"
              button
              component={normmalisedUrl ? "a" : undefined}
              href={normmalisedUrl ?? undefined}
              target={normmalisedUrl ? "_blank" : undefined}
              download={normmalisedUrl ? normmaliseDownload(item) : undefined}
              onClick={item.blob ? () => downloadDataUrl(item.blob, item.name, item.format) : undefined}
            >
              <PaneIcon component={icons[item.type]} />
              &emsp;
              { item.name || `${item.type} file` }
            </UiDropdownMenu.Item>
          );
        }
      )
    );
  }

}

DownloadFilesMenuContent.displayName = "DownloadFilesMenuContent";

DownloadFilesMenuContent.propTypes = {
  files: PropTypes.object,
};

export default DownloadFilesMenuContent;
