import GridOnIcon from "@material-ui/icons/GridOn";
import PropTypes from "prop-types";
import React from "react";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";

import "../css/drop-files-graphics.css";
import FileIcon from "./FileIcon.react";
import RectangularTreeIcon from "./RectangularTreeIcon.react";
import { FileKind } from "../utils/prop-types";

const DropFilesGraphics = (props) => {
  return (
    <div
      className="drop-files-graphics"
    >
      <header>
        <strong>Drop files here</strong>
        <br />
        <b
          onClick={props.onAddFiles}
        >
          browse your files
        </b>
        &nbsp;or&nbsp;
        <b
          onClick={props.onAddUrls}
        >
          add Urls
        </b>
      </header>

      <figure
        onClick={props.onAddFiles}
      >
        { (!props.fileKind || props.fileKind === "data") && <FileIcon label="data" icon={GridOnIcon} /> }
        { (!props.fileKind || props.fileKind === "network") && <FileIcon label="network" icon={ShareTwoToneIcon} /> }
        { (!props.fileKind || props.fileKind === "tree") && <FileIcon label="tree" icon={RectangularTreeIcon} /> }
        { (props.fileKind && props.fileKind !== "data" && props.fileKind !== "network" && props.fileKind !== "tree") && <FileIcon label="tree" /> }
      </figure>

      <footer>
        <strong>
          <a
            href="https://docs.microreact.org/instructions/creating-a-microreact-project/supported-file-formats"
            target="_blank"
          >
            Supported files
          </a>:
        </strong>
        <p>
          {
            props.validFileExtensions.reduce(
              (accumulator, currentValue, currentIndex, array) => {
                if (currentIndex > 0) {
                  accumulator.push(", ");
                }
                if (array.length > 1 && currentIndex === array.length - 1) {
                  accumulator.push(" and ");
                }
                accumulator.push(<code key={currentValue}>.{currentValue}</code>);
                return accumulator;
              },
              [],
            )
          }
        </p>
      </footer>
    </div>
  );
};

DropFilesGraphics.displayName = "DropFilesGraphics";

DropFilesGraphics.propTypes = {
  fileKind: FileKind,
  onAddFiles: PropTypes.func.isRequired,
  validFileExtensions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DropFilesGraphics;
