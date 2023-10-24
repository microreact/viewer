import PropTypes from "prop-types";
import React, { Fragment } from "react";
import formatDistanceStrict from "date-fns/formatDistanceStrict";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { Box } from "@mui/material";
import * as Datetime from "../utils/datetime.js";

function QuickFilter(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFilter = (filter) => {
    handleClose();
    props.onTimelineFilter(filter);
  };

  return (
    <div>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        style={{ minWidth: 0, padding: 0 }}
      >
        <ArrowDropDownIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        dense
        onClose={handleClose}
        open={open}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleFilter("7-days")}>
          Last 7 days
        </MenuItem>
        <MenuItem onClick={() => handleFilter("14-days")}>
          Last 14 days
        </MenuItem>
        <MenuItem onClick={() => handleFilter("30-days")}>
          Last 30 days
        </MenuItem>
        <MenuItem onClick={() => handleFilter("3-months")}>
          Last 3 months
        </MenuItem>
        <MenuItem onClick={() => handleFilter("6-months")}>
          Last 6 months
        </MenuItem>
        <MenuItem onClick={() => handleFilter("12-months")}>
          Last 12 months
        </MenuItem>
      </Menu>
    </div>
  );
}

QuickFilter.propTypes = {
  onTimelineFilter: PropTypes.func.isRequired,
};

function TimeLineRange(props) {
  const handleMinBoundChange = (event) => {
    const timestamp = Datetime.ISODateToTimestamp(event.target.value);
    if (Datetime.isTimestamp(timestamp)) {
      const bounds = [...props.bounds];
      bounds[0] = timestamp;
      props.onChange(bounds);
    }
  };

  const handleMaxBoundChange = (event) => {
    const timestamp = Datetime.ISODateToTimestamp(event.target.value);
    if (Datetime.isTimestamp(timestamp)) {
      const bounds = [...props.bounds];
      bounds[1] = timestamp;
      props.onChange(bounds);
    }
  };

  if (props.bounds === null) {
    return false;
  }

  return (
    <div className="mr-time-range">
      <Paper>
        <InputBase
          onChange={handleMinBoundChange}
          type="date"
          value={Datetime.timestampToISODate(props.bounds[0])}
        />
        <Divider orientation="vertical" />
        <Box>
          {formatDistanceStrict(props.bounds[0], props.bounds[1])}
        </Box>
        <Divider orientation="vertical" />
        <InputBase
          onChange={handleMaxBoundChange}
          type="date"
          value={Datetime.timestampToISODate(props.bounds[1])}
        />
        <QuickFilter
          onTimelineFilter={props.onTimelineFilter}
        />
      </Paper>
    </div>

  );
}

TimeLineRange.propTypes = {
  bounds: PropTypes.array,
  distance: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onTimelineFilter: PropTypes.func.isRequired,
};

export default TimeLineRange;
