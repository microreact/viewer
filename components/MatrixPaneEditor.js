import PropTypes from "prop-types";
import React from "react";

import FileEditor from "../containers/FileEditor.react";

function MatrixPaneEditor(props) {
  return (
    <React.Fragment>
      <FileEditor
        defaultFileType="matrix"
        fileId={props.matrixState.file}
        label="Matrix File"
        paneId={props.matrixId}
      />
    </React.Fragment>
  );
}

MatrixPaneEditor.displayName = "MatrixPaneEditor";

MatrixPaneEditor.propTypes = {
  matrixFile: PropTypes.object,
  matrixId: PropTypes.string.isRequired,
  matrixState: PropTypes.object.isRequired,
  onMatrixPropChange: PropTypes.func.isRequired,
};

export default MatrixPaneEditor;
