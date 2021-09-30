import { mdiFilter } from "@mdi/js";
import CheckBoxRoundedIcon from "@material-ui/icons/CheckBoxRounded";
import PropTypes from "prop-types";
import React from "react";

import MdiIcon from "./MdiIcon.react";
import UiControlsButton from "./UiControlsButton.react";

const ToggleSelectionOnlyButton = React.memo(
  (props) => (
    <UiControlsButton
      // active={props.active}
      className={props.className}
      onClick={() => props.onChange(!props.active)}
      title={props.active ? "Show filtered data" : "Show selected data"}
    >
      {
        props.active
          ?
          <CheckBoxRoundedIcon />
          :
          <MdiIcon fontSize="small" >{ mdiFilter }</MdiIcon>
      }
    </UiControlsButton>
  ),
);

ToggleSelectionOnlyButton.displayName = "ToggleSelectionOnlyButton";

ToggleSelectionOnlyButton.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ToggleSelectionOnlyButton;
