import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

const RadialTreeIcon = React.memo(
  (props) => (
    <SvgIcon
      {...props}
      viewBox="0 0 22 22"
    >
      <g transform="translate(617 345)">
        <g>
          <g>
            <path d="M 10.5363 0.266879L 12.0363 5.68355L 13.9637 5.14979L 12.4637 -0.266879L 10.5363 0.266879ZM 13.4913 6.28765L 19.9913 2.62098L 19.0087 0.879022L 12.5087 4.54569L 13.4913 6.28765ZM 12.1221 4.93781L 9.1221 10.4378L 10.8779 11.3955L 13.8779 5.89552L 12.1221 4.93781ZM 10.296 9.96149L 0.29603 6.86228L -0.29603 8.77264L 9.70397 11.8718L 10.296 9.96149ZM 9.1221 11.3955L 11.6221 15.9789L 13.3779 15.0211L 10.8779 10.4378L 9.1221 11.3955ZM 11.5862 15.0939L 9.58619 19.5939L 11.4138 20.4061L 13.4138 15.9061L 11.5862 15.0939ZM 12.2078 16.4564L 18.2078 18.2897L 18.7922 16.377L 12.7922 14.5436L 12.2078 16.4564Z" transform="translate(-616 -344)"></path>
          </g>
        </g>
      </g>
    </SvgIcon>
  ),
);

RadialTreeIcon.displayName = "RadialTreeIcon";

export default RadialTreeIcon;
