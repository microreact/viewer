import React from "react";
import PropTypes from "prop-types";
import SvgIcon from "@material-ui/core/SvgIcon";

const MdiIcon = React.memo(
  ({ children, ...rest }) => (
    <SvgIcon {...rest}>
      <path d={children} />
    </SvgIcon>
  ),
);

MdiIcon.propTypes = {
  children: PropTypes.node,
};

MdiIcon.displayName = "MdiIcon";

export default MdiIcon;
