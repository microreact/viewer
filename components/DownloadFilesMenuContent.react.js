import PropTypes from "prop-types";
import React from "react";

import UiDropdownMenu from "./UiDropdownMenu.react";
import PaneIcon from "./PaneIcon.react";

import { downloadDataUrl } from "../utils/downloads";

const icons = {
  data: "Table",
  network: "Network",
  tree: "Tree",
  geo: "Map",
};

class DownloadFilesMenuContent extends React.PureComponent {

  filesSelector() {
    const { props } = this;
    return Object.values(props.files);
  }

  render() {
    return (
      this.filesSelector().map(
        (item) => (
          <UiDropdownMenu.Item
            key={item.id}
            alignItems="flex-start"
            button
            component={item.url ? "a" : undefined}
            href={item.url ?? undefined}
            target={item.url ? "_blank" : undefined}
            download={item.url ? item.name : undefined}
            onClick={item.blob ? () => downloadDataUrl(item.blob, item.name, item.format) : undefined}
          >
            <PaneIcon component={icons[item.type]} />
            &emsp;
            { item.name || `${item.type} file` }
          </UiDropdownMenu.Item>
        )
      )
    );
  }

}

DownloadFilesMenuContent.displayName = "DownloadFilesMenuContent";

DownloadFilesMenuContent.propTypes = {
  files: PropTypes.object,
};

export default DownloadFilesMenuContent;
