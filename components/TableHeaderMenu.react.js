import classnames from "classnames";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import React from "react";

// import "../styles/table-column-menu.css";
import { DataColumn, DataFilter } from "../utils/prop-types";
import TableHeaderMenuContent from "../containers/TableColumnControls.react";
import UiPopoverMenu from "./UiPopoverMenu.react";

class TableHeaderMenu extends React.PureComponent {

  menuRef = React.createRef();

  render() {
    const { props } = this;
    return (
      <UiPopoverMenu
        button={IconButton}
        buttonProps={
          {
            className: classnames(
              "mr-table-column-menu-trigger",
              { "mr-has-filters": !!this.props.filter },
            ),
            color: "primary",
            component: "button",
            size: "small",
            children: (<FilterListRoundedIcon />),
          }
        }
        className="mr-table-column-menu"
        direction="right"
        ref={this.menuRef}
        title={this.props.title}
      >
        <TableHeaderMenuContent
          dataColumn={props.dataColumn}
          menuRef={this.menuRef}
          tableId={props.tableId}
        />
      </UiPopoverMenu>
    );
  }

}

TableHeaderMenu.displayName = "TableHeaderMenu";

TableHeaderMenu.propTypes = {
  dataColumn: DataColumn.isRequired,
  filter: DataFilter,
  tableId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default TableHeaderMenu;
