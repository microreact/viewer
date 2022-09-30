import PropTypes from "prop-types";
import React from "react";
import SpeedDial from "@mui/lab/SpeedDial";
import SpeedDialAction from "@mui/lab/SpeedDialAction";
import Backdrop from "@mui/material/Backdrop";
import SpeedDialIcon from "@mui/lab/SpeedDialIcon";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { mdiLinkVariantPlus } from "@mdi/js";

// import "../styles/plus-actions.css";
import UiSvgIcon from "./UiSvgIcon.react";

class PlusFloatingActingButton extends React.PureComponent {

  state = {
    isOpen: false,
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  handleOpen = () => {
    this.setState({ isOpen: true });
  };

  render() {
    return (
      <div className="mr-plus-actions">
        <Backdrop open={this.state.isOpen} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          icon={<SpeedDialIcon />}
          // onClose={this.handleClose}
          // onOpen={this.handleOpen}
          open={this.state.isOpen}
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        >
          {/* <SpeedDialAction
            icon={<ComputerTwoToneIcon />}
            tooltipTitle="Load from Local Storage"
            tooltipOpen
            onClick={() => this.listLocalProjectsRef.current.open()}
          /> */}
          <SpeedDialAction
            icon={<InsertDriveFileIcon />}
            tooltipTitle="Browse Files"
            tooltipOpen
            onClick={this.props.onBrowseFiles}
          />
          <SpeedDialAction
            icon={<UiSvgIcon>{ mdiLinkVariantPlus }</UiSvgIcon>}
            tooltipTitle="Add URLs"
            tooltipOpen
            onClick={this.props.onAddUrls}
          />
        </SpeedDial>
      </div>
    );
  }

}

PlusFloatingActingButton.propTypes = {
  onAddUrls: PropTypes.func.isRequired,
  onBrowseFiles: PropTypes.func.isRequired,
};

export default PlusFloatingActingButton;
