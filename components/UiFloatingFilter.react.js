import { createSelector } from "reselect";
import BackspaceIcon from "@material-ui/icons/Backspace";
import classnames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from "prop-types";
import React from "react";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import TextField from "@material-ui/core/TextField";

import "../css/ui-floating-filter.css";

class UiFloatingFilter extends React.PureComponent {

  state = {
    filter: "",
  }

  inputRef = React.createRef()

  itemsSelector = createSelector(
    (props) => props.items,
    (props) => props.valueGetter,
    (props) => props.createNewItem,
    (_, state) => state.filter,
    (
      allItems,
      valueGetter,
      createNewItem,
      filter,
    ) => {
      let items = allItems;

      if (filter) {
        const filterText = filter.toLowerCase();
        items = items.filter((item) => valueGetter(item)?.includes(filterText));

        if (createNewItem) {
          if (!items.find((item) => valueGetter(item) === filterText)) {
            items.push(createNewItem(filter));
          }
        }
      }

      return items;
    }
  );

  handleClearFilter = () => {
    this.setState({ filter: "" });
    this.inputRef?.current?.focus();
  }

  render() {
    const { props, state } = this;
    const items = this.itemsSelector(props, state);

    return (
      <div
        className={
          classnames(
            "mr-floating-filter",
            props.className,
          )
        }
      >
        {/* <label className="mr-filter-box">
          <SearchRoundedIcon
            title={props.label}
          />
          <input
            className={this.state.filter ? "mr-not-empty" : "mr-empty"}
            onChange={(event) => this.setState({ filter: event.target.value })}
            value={this.state.filter}
            placeholder={props.label}
            style={
              { width: `${measureWidth(this.state.filter)}px` }
            }
            ref={this.inputRef}
          />
        </label> */}

        {
          !props.disabled && (
            <TextField
              autoFocus
              variant="outlined"
              placeholder={props.label}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    style={
                      { visibility: (!state.filter) ? "hidden" : "visible" }
                    }
                  >
                    <IconButton
                      onClick={this.handleClearFilter}
                      edge="end"
                      size="small"
                    >
                      <BackspaceIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputRef={this.inputRef}
              className="mr-filter"
              onChange={(event) => this.setState({ filter: event.target.value })}
              value={state.filter}
            />
          )
        }

        {
          props.children(items)
        }
      </div>
    );
  }

}

UiFloatingFilter.displayName = "UiFloatingFilter";

UiFloatingFilter.propTypes = {
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  createNew: PropTypes.bool,
};

UiFloatingFilter.defaultProps = {
  label: "Search",
  valueGetter: (x) => x.name.toString().toLowerCase(),
};

export default UiFloatingFilter;
