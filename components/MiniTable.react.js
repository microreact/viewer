/* eslint "react/prop-types": 0 */

import React from "react";
import PropTypes from "prop-types";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import BaseTable from "react-base-table/lib";

export default class extends React.PureComponent {

  static displayName = "MiniTable"

  static propTypes = {
    data: PropTypes.object.isRequired,
    onHeaderClick: PropTypes.func,
  }

  state = {
    columnIndex: null,
    rowIndex: null,
    scrollToRow: 0,
  }

  render() {
    const { props } = this;

    return (
      <AutoSizer>
        {
          ({ height, width }) => (
            <BaseTable
              fixed
              className="mr-mini-table"
              columns={
                props.data.columns
                  .sort((a, b) => {
                    if (props.activeFields.includes(a) && props.activeFields.includes(b)) {
                      return 0;
                    }
                    if (props.activeFields.includes(a)) {
                      return -1;
                    }
                    if (props.activeFields.includes(b)) {
                      return 1;
                    }
                    return 0;
                  })
                  .map(
                    (x) => ({
                      active: props.activeFields.includes(x),
                      className: props.activeFields.includes(x) ? "active" : "inactive",
                      dataKey: x.name,
                      key: x.name,
                      headerClassName: props.activeFields.includes(x) ? "active" : "inactive",
                      name: x.name,
                      minWidth: 120,
                      title: x.label || x.name,
                      width: Math.max(120, x.name.length * 13 * 0.66),
                    })
                  )
              }
              data={props.data.rows}
              rowKey={"--mr-index"}
              width={width}
              height={Math.max(200, height - 4)}
              headerCellProps={
                ({ column }) => {
                  return {
                    tagName: (args) => (
                      <div
                        {...args}
                        title={column.active ? "Click to select" : props.inactiveColumnTitle}
                        onClick={
                          (event) => {
                            if (column.active) {
                              props.onHeaderClick(props.data.columns.find((x) => x.name === column.name), event);
                            }
                          }
                        }
                      />
                    ),
                  };
                }
              }
            />
          )
        }
      </AutoSizer>
    );
  }

}
