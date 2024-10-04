import classnames from "classnames";
import FormControlLabel from "@mui/material/FormControlLabel";
import PropTypes from "prop-types";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React from "react";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

// import "../styles/ui-radio-list.css";

import EmptyIcon from "./EmptyIcon.react";

const UiRadioList = React.memo(
  (props) => {
    const control = (
      props.boxed
        ?
        <Radio
          color="primary"
          size="small"
        />
        :
        <Radio
          color="primary"
          size="small"
          icon={<EmptyIcon />}
          checkedIcon={<DoneRoundedIcon />}
        />
    );
    return (
      <RadioGroup
        className={
          classnames(
            "mr-ui-radio-list",
            props.className,
          )
        }
        onChange={(event) => props.onChange(event.target.value)}
        value={props.value || null}
        style={props.style}
      >
        {
          props.nullable && (
            <FormControlLabel
              control={control}
              label={props.nullOptionLabel}
              value={null}
            />
          )
        }
        {
          props.items.map(
            (item) => (
              <FormControlLabel
                control={control}
                key={item[props.valueProperty]}
                label={item[props.labelProperty]}
                value={item[props.valueProperty]}
              />
            )
          )
        }
      </RadioGroup>
    );
  },
);

UiRadioList.displayName = "RadioList";

UiRadioList.propTypes = {
  boxed: PropTypes.bool,
  className: PropTypes.string,
  items: PropTypes.array,
  labelProperty: PropTypes.string,
  nullable: PropTypes.bool,
  nullOptionLabel: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  value: PropTypes.string,
  valueProperty: PropTypes.string,
};

UiRadioList.defaultProps = {
  boxed: true,
  labelProperty: "label",
  nullable: false,
  nullOptionLabel: "None",
  valueProperty: "value",
};

export default UiRadioList;
