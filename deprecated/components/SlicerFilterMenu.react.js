import classnames from "classnames";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";

import "../css/table-column-menu.css";
import { DataFilter, DataField } from "../utils/prop-types";
import TableColumnControls from "../containers/TableColumnControls.react";
import UiPopoverMenu from "./UiPopoverMenu.react";

class SlicerFilterMenu extends React.PureComponent {

  menuRef = React.createRef();

  render() {
    const { props } = this;
    return (
      <UiPopoverMenu
        button={IconButton}
        buttonProps={
          {
            className: classnames(
              "mr-slicer-menu-trigger",
              { "mr-has-filters": !!this.props.filter },
            ),
            color: "primary",
            component: "span",
            size: "small",
            children: (<FilterListRoundedIcon />),
          }
        }
        className="mr-table-column-menu"
        direction="right"
        enableCloseButton
        title={this.props.dataField.name}
        ref={this.menuRef}
      >
        <TableColumnControls
          dataField={props.dataField}
          menuRef={this.menuRef}
          filtersOnly
        />
      </UiPopoverMenu>
    );
  }

}

SlicerFilterMenu.displayName = "SlicerFilterMenu";

SlicerFilterMenu.propTypes = {
  dataField: DataField.isRequired,
  filter: DataFilter,
};

export default SlicerFilterMenu;
