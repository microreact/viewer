import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const style = { height: 40 };

const UiToggleButtons = React.memo(
  (props) => (
    <Box
      className="mr-toggle-buttons"
      alignItems="center"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      style={style}
    >
      { props.label }
      <ToggleButtonGroup
        size="small"
        value={props.value}
        exclusive
        onChange={(event, value) => props.onChange(value)}
      >
        {
          props.children.map(
            (x) => (
              <ToggleButton
                key={x.props.value}
                value={x.props.value}
                title={x.props.title}
              >
                { x }
              </ToggleButton>
            )
          )
        }
      </ToggleButtonGroup>
    </Box>
  )
);

UiToggleButtons.displayName = "UiToggleButtons";

UiToggleButtons.propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

export default UiToggleButtons;
