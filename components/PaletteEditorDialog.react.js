import PropTypes from "prop-types";
import React from "react";

import PaletteEditor from "../containers/PaletteEditor.react";

const PaletteEditorDialog = React.memo(
  (props) => {
    if (props.isOpen) {
      return (<PaletteEditor {...props} />);
    }
    else {
      return null;
    }
  }
);

PaletteEditorDialog.displayName = "PaletteEditorDialog";

PaletteEditorDialog.propTypes = {
  isOpen: PropTypes.bool,
};

export default PaletteEditorDialog;
