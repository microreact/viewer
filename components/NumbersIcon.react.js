import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import { mdiNumeric } from "@mdi/js";

const NumbersIcon = React.memo(
  (props) => (
    <SvgIcon {...props}>
      <path d={mdiNumeric} />
    </SvgIcon>
  ),
);

NumbersIcon.displayName = "NumbersIcon";

export default NumbersIcon;
