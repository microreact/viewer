import PropTypes from "prop-types";
import React from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { mdiLinkVariantPlus } from "@mdi/js";

import "../css/plus-actions.css";
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
