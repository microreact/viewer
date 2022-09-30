import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

const EmptyIcon = React.memo(
  (props) => (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
    >
    </SvgIcon>
  ),
);

EmptyIcon.displayName = "EmptyIcon";

export default EmptyIcon;
