import classnames from "classnames";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

const LassoIcon = React.memo(
  (props) => (
    <SvgIcon {...props} viewBox="0 0 22 22">
      <g transform="translate(593 387)">
        <g opacity="0.375">
          <path d="M -1.89315e-07 0L 0.123997 -0.992283L -1.35966 -1.17768L -0.964432 0.264332L -1.89315e-07 0ZM 4.01985 14.6667L 3.05542 14.931L 3.31413 15.8749L 4.26338 15.6366L 4.01985 14.6667ZM 14.6402 12L 14.8837 12.9699L 15.4278 12.8333L 15.5948 12.2977L 14.6402 12ZM 10.794 0.341051L 0.123997 -0.992283L -0.123997 0.992283L 10.546 2.32562L 10.794 0.341051ZM -0.964432 0.264332L 3.05542 14.931L 4.98428 14.4023L 0.964432 -0.264332L -0.964432 0.264332ZM 4.26338 15.6366L 14.8837 12.9699L 14.3967 11.0301L 3.77632 13.6968L 4.26338 15.6366ZM 15.5948 12.2977L 18.2747 3.70515L 16.3654 3.10967L 13.6856 11.7023L 15.5948 12.2977Z" transform="translate(-589.32 -383.333)"></path>
        </g>
        <g>
          <path d="M 2.6799 5.33333C 4.15997 5.33333 5.3598 4.13943 5.3598 2.66667C 5.3598 1.19391 4.15997 0 2.6799 0C 1.19983 0 0 1.19391 0 2.66667C 0 4.13943 1.19983 5.33333 2.6799 5.33333Z" transform="translate(-592 -386)"></path>
        </g>
        <g>
          <path d="M 2.6799 5.33333C 4.15997 5.33333 5.3598 4.13943 5.3598 2.66667C 5.3598 1.19391 4.15997 0 2.6799 0C 1.19983 0 0 1.19391 0 2.66667C 0 4.13943 1.19983 5.33333 2.6799 5.33333Z" transform="translate(-581.33 -384.667)"></path>
        </g>
        <g>
          <path d="M 2.6799 5.33333C 4.15997 5.33333 5.3598 4.13943 5.3598 2.66667C 5.3598 1.19391 4.15997 0 2.6799 0C 1.19983 0 0 1.19391 0 2.66667C 0 4.13943 1.19983 5.33333 2.6799 5.33333Z" transform="translate(-587.98 -371.333)"></path>
        </g>
        <g>
          <path d="M 2.6799 5.33333C 4.15997 5.33333 5.3598 4.13943 5.3598 2.66667C 5.3598 1.19391 4.15997 0 2.6799 0C 1.19983 0 0 1.19391 0 2.66667C 0 4.13943 1.19983 5.33333 2.6799 5.33333Z" transform="translate(-577.36 -374)"></path>
        </g>
      </g>
    </SvgIcon>
  ),
);

LassoIcon.displayName = "LassoIcon";

const LassoButton = React.memo(
  (props) => {
    const { active, ...rest } = props;
    return (
      <Button
        {...rest}
        className={
          classnames(
            "mr-controls-button",
            props.className,
          )
        }
        color={active ? "primary" : "inherit"}
        onClick={props.onClick}
        size="small"
        title={
          props.title || (active ? "Disable lasso filter" : "Activate lasso filter")
        }
        variant="contained"
      >
        <LassoIcon />
      </Button>
    );
  }
);

LassoButton.displayName = "LassoButton";

LassoButton.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default LassoButton;
