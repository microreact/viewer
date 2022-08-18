import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import KeyboardArrowRightRoundedIcon from "@material-ui/icons/KeyboardArrowRightRounded";
import PropTypes from "prop-types";
import React from "react";

import "../css/process-files.css";

class ProcessFiles extends React.PureComponent {

  render() {
    const { props } = this;

    if (props.isLoading) {
      return (
        <div
          className="mr-process-files-container"
        >
          <div className="mr-process-files-spinner">
            <CircularProgress
              size={430}
              thickness={1}
            />
          </div>
        </div>
      );
    }

    return null;
  }

}

ProcessFiles.displayName = "ProcessFiles";

ProcessFiles.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default ProcessFiles;
