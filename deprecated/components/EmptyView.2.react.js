import Container from "@material-ui/core/Container";
import GridOnIcon from "@material-ui/icons/GridOn";
import PropTypes from "prop-types";
import React from "react";

import "../css/empty-view.css";
import FileIcon from "./FileIcon.react";
import NetworkIcon from "./NetworkIcon.react";
import RectangularTreeIcon from "./RectangularTreeIcon.react";
import DropFiles from "./DropFiles.react";

const EmptyView = (props) => {
  return (
    <Container
      className="empty-view-container"
      maxWidth={false}
    >
      <DropFiles
        onFileUpload={props.onFileUpload}
        validFileExtensions={props.validFileExtensions}
      >
        <div className="empty-view">
          <header>
            <strong>Drop files here</strong>
            <br />
            or browse your files
          </header>

          <div className="empty-view-graphics">
            <div>
              <FileIcon label="data" icon={GridOnIcon} />
              <FileIcon label="network" icon={NetworkIcon} />
              <FileIcon label="tree" icon={RectangularTreeIcon} />
            </div>
          </div>

          <footer>
            <strong>Supported files:</strong>
            <p>
              {
                props.validFileExtensions.reduce(
                  (accumulator, currentValue, currentIndex, array) => {
                    if (currentIndex > 0) {
                      accumulator.push(", ");
                    }
                    if (currentIndex === array.length - 1) {
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
      </DropFiles>
    </Container>
  );
};

EmptyView.displayName = "EmptyView";

EmptyView.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  validFileExtensions: PropTypes.array.isRequired,
};

export default EmptyView;
