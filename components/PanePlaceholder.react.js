import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import React from "react";

// import "../styles/pane-placeholder.css";
import { FileDescriptor } from "../utils/prop-types";

import PaneIcon from "./PaneIcon.react";
import FileLoader from "../containers/FileLoader.react";

const PanePlaceholder = React.memo(
  (props) => {
    const { PaneComponent, isEmpty, file, ...rest } = props;

    if (isEmpty) {
      return (
        <div
          className="mr-pane-placeholder"
          onClick={props.onEditPane}
        >
          <figure>
            <PaneIcon component={props.componentName} />
          </figure>
          <Button
            variant="outlined"
            disableElevation
            size="small"
          >
            { props.emptyLabel ?? `Edit${props.componentName}` }
          </Button>
        </div>
      );
    }

    else if (file && !file._content) {
      return (
        <FileLoader file={file} />
      );
    }

    return (
      <PaneComponent
        {...rest}
      />
    );

  }
);

PanePlaceholder.displayName = "PanePlaceholder";

PanePlaceholder.propTypes = {
  componentName: PropTypes.string,
  emptyLabel: PropTypes.string,
  file: FileDescriptor,
  isEmpty: PropTypes.bool.isRequired,
  onEditPane: PropTypes.func.isRequired,
  PaneComponent: PropTypes.object.isRequired,
};

PanePlaceholder.defaultProps = {
  isEmpty: true,
};

export default PanePlaceholder;
