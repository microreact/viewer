import classnames from "classnames";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import React from "react";

// import "../styles/table-column-menu.css";
import { DataFilter, TableColumn } from "../utils/prop-types";
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
            component: "span",
            size: "small",
            children: (<FilterListRoundedIcon />),
          }
        }
        className="mr-table-column-menu"
        direction="right"
        ref={this.menuRef}
        title={this.props.tableColumn.title}
      >
        <TableHeaderMenuContent
          menuRef={this.menuRef}
          tableColumn={props.tableColumn}
        />
      </UiPopoverMenu>
    );
  }

}

TableHeaderMenu.displayName = "TableHeaderMenu";

TableHeaderMenu.propTypes = {
  tableColumn: TableColumn.isRequired,
  filter: DataFilter,
};

export default TableHeaderMenu;
