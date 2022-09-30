import classnames from "classnames";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import PropTypes from "prop-types";
import React from "react";

// import "../styles/ui-dialog.css";
import { getContainerElement } from "../utils/html";

class UiDialog extends React.PureComponent {

  state = {
    isDialogOpen: false,
  };

  open = () => {
    this.setState({
      isDialogOpen: true,
    });
  }

  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
    else {
      this.setState({ isDialogOpen: false });
    }
  }

  render() {
    const { props } = this;

    const isOpen = props.isOpen ?? this.state.isDialogOpen;

    if (!isOpen) {
      return null;
    }

    return (
      <Dialog
        className={
          classnames(
            "mr-ui-dialog",
            props.className,
          )
        }
        container={getContainerElement}
        disableBackdropClick
        fullWidth
        maxWidth={props.maxWidth}
        onClose={this.close}
        open={isOpen}
        disableEscapeKeyDown
      >
        { props.showProgress && (<LinearProgress />) }

        <DialogTitle>
          { props.title }
          {
            props.hasCloseButton && (
              <IconButton
                className="mr-floating-action-buttons"
                onClick={this.close}
                size="small"
              >
                <CloseRoundedIcon />
              </IconButton>
            )
          }
        </DialogTitle>

        <DialogContent dividers={!props.disableDividers}>
          { props.children }
        </DialogContent>

        {
          props.actions && (
            <DialogActions>
              { props.actions }
            </DialogActions>
          )
        }
      </Dialog>
    );
  }

}

UiDialog.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hasCloseButton: PropTypes.bool,
  isOpen: PropTypes.bool,
  maxWidth: PropTypes.string,
  onClose: PropTypes.func,
  showProgress: PropTypes.bool,
  title: PropTypes.node,
};

UiDialog.defaultProps = {
  hasCloseButton: true,
  isOpen: false,
  maxWidth: "sm",
};

UiDialog.displayName = "UiDialog";

export default UiDialog;
