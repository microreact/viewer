import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import "../css/ui-speed-dial.css";

const floatingActingButtonProps = {
  className: "mr-controls-button",
  size: "small",
  color: "default",
  style: { transition: "" },
};

class UiSpeedDial extends React.PureComponent {

  static displayName = "UiSpeedDial";

  static propTypes = {
    className: PropTypes.string,
    iconProperty: PropTypes.string,
    items: PropTypes.array.isRequired,
    label: PropTypes.string,
    labelProperty: PropTypes.string,
    nullable: PropTypes.bool,
    nullOptionLabel: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.string,
    valueProperty: PropTypes.string,
  };

  static defaultProps = {
    labelProperty: "label",
    valueProperty: "value",
    iconProperty: "icon",
  }

  state = {
    isOpen: false,
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  handleOpen = () => {
    this.setState({ isOpen: true });
  };

  handleClick = (item, event) => {
    this.handleClose();
    this.props.onChange(item[this.props.valueProperty], event);
  }

  render() {
    const { props } = this;

    const selectedItem = props.items.find((x) => x[props.valueProperty] === props.value);

    return (
      <div
        className={
          classnames(
            "mr-ui-speed-dial",
            "mr-controls-button",
            props.className,
          )
        }
        style={props.style}
      >
        <SpeedDial
          ariaLabel={props.label}
          direction="down"
          FabProps={
            {
              ...floatingActingButtonProps,
              title: props.label,
            }
          }
          icon={selectedItem[props.iconProperty]}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          open={this.state.isOpen}
        >
          {
            props.items.map(
              (item) => (
                (item !== selectedItem) && (
                  <SpeedDialAction
                    FabProps={floatingActingButtonProps}
                    icon={item[props.iconProperty]}
                    key={item[props.valueProperty]}
                    onClick={(event) => this.handleClick(item, event)}
                    tooltipTitle={item[props.labelProperty]}
                  />
                )
              )
            )
          }
        </SpeedDial>
      </div>
    );
  }

}

export default UiSpeedDial;
