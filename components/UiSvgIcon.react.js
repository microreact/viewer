import React from "react";
import PropTypes from "prop-types";
import SvgIcon from "@material-ui/core/SvgIcon";

const UiSvgIcon = React.memo(
  ({ children, ...rest }) => (
    <SvgIcon {...rest}>
      <path d={children} />
    </SvgIcon>
  ),
);

UiSvgIcon.propTypes = {
  children: PropTypes.node,
};

UiSvgIcon.displayName = "UiSvgIcon";

export default UiSvgIcon;
