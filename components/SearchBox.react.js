import classnames from "classnames";
import { DebounceInput } from "react-debounce-input";
import ExplicitRoundedIcon from "@material-ui/icons/ExplicitRounded";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import PropTypes from "prop-types";
import React from "react";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";

import UiDropdownMenu from "./UiDropdownMenu.react";
import "../css/search-box.css";

const resetFiltersMenuButtonProps = {
  // color: "primary",
  title: "Reset filters",
  // size: "small",
  children: (<FilterListRoundedIcon />),
};

const ResetFiltersMenu = React.memo(
  (props) => (
    <UiDropdownMenu
      button="button"
      buttonProps={resetFiltersMenuButtonProps}
    >
      <UiDropdownMenu.Item
        onClick={props.onResetAllFilters}
      >
        Reset All Filters
      </UiDropdownMenu.Item>

      <UiDropdownMenu.Item
        onClick={props.onResetTableFilters}
      >
        Reset Table Filter
      </UiDropdownMenu.Item>

      {
        props.hasMaps &&
        <UiDropdownMenu.Item
          onClick={props.onResetMapFilters}
        >
          Reset Map Filter
        </UiDropdownMenu.Item>
      }

      {
        props.hasNetworks &&
        <UiDropdownMenu.Item
          onClick={props.onResetNetworkFilters}
        >
          Reset Network Filter
        </UiDropdownMenu.Item>
      }

      {
        props.hasTimelines &&
        <UiDropdownMenu.Item
          onClick={props.onResetTimelineFilters}
        >
          Reset Timeline Filter
        </UiDropdownMenu.Item>
      }

      {
        props.hasTrees &&
        <UiDropdownMenu.Item
          onClick={props.onResetTreeFilters}
        >
          Reset Tree Filter
        </UiDropdownMenu.Item>
      }
    </UiDropdownMenu>
  )
);

ResetFiltersMenu.displayName = "ResetFiltersMenu";

class SearchBox extends React.PureComponent {

  state = {
    focus: false,
    extactMatch: false,
  }

  inputRef = React.createRef()

  onFocus = () => {
    this.setState({ focus: true });
  }

  onBlur = () => {
    this.setState({ focus: false });
  }

  onClick = () => {
    this.inputRef.current.focus();
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;
    this.props.onSearchValueChange(searchValue);
  }

  render() {
    const { props } = this;

    return (
      <div
        className={
          classnames(
            "mr-search-box",
            { "mr-search-box--active": this.state.focus },
          )
        }
        onClick={this.onClick}
      >
        <SearchRoundedIcon
          title="Use filter buttons in data table headers to search in a specific column"
        />
        <button
          className={
            classnames(
              { active: props.searchOperator !== "includes" },
            )
          }
          onClick={
            () => props.onSearchOperatorChange(
              (props.searchOperator === "includes") ? "equals" : "includes"
            )
          }
          title={
            (props.searchOperator === "includes") ? "Switch to exact match" : "Switch to partial match"
          }
        >
          <ExplicitRoundedIcon />
        </button>
        <DebounceInput
          className="mr-search-box__input"
          debounceTimeout={1000}
          minLength={1}
          onBlur={this.onBlur}
          onChange={this.handleSearchValueChange}
          onFocus={this.onFocus}
          placeholder="SEARCH IN ALL COLUMNS"
          inputRef={this.inputRef}
          type="text"
          value={props.searchValue}
        />
        <span className="mr-search-totals">
          {props.visibleRowCount} of {props.rowCount}
        </span>

        <ResetFiltersMenu
          hasMaps={props.hasMaps}
          hasNetworks={props.hasNetworks}
          hasTimelines={props.hasTimelines}
          hasTrees={props.hasTrees}
          onResetAllFilters={props.onResetAllFilters}
          onResetMapFilters={props.onResetMapFilters}
          onResetNetworkFilters={props.onResetNetworkFilters}
          onResetTableFilters={props.onResetTableFilters}
          onResetTimelineFilters={props.onResetTimelineFilters}
          onResetTreeFilters={props.onResetTreeFilters}
        />

        {/*
        <Tour
          id="search"
          pointer="top"
          style={{ top: "40px", left: "-192px" }}
        />
        */}
      </div>
    );
  }

}

SearchBox.displayName = "SearchBox";

SearchBox.propTypes = {
  filteredRowCount: PropTypes.number,
  hasMaps: PropTypes.bool.isRequired,
  hasNetworks: PropTypes.bool.isRequired,
  hasTimelines: PropTypes.bool.isRequired,
  hasTrees: PropTypes.bool.isRequired,
  onResetAllFilters: PropTypes.func.isRequired,
  onResetMapFilters: PropTypes.func.isRequired,
  onResetNetworkFilters: PropTypes.func.isRequired,
  onResetTableFilters: PropTypes.func.isRequired,
  onResetTimelineFilters: PropTypes.func.isRequired,
  onResetTreeFilters: PropTypes.func.isRequired,
  onSearchOperatorChange: PropTypes.func.isRequired,
  onSearchValueChange: PropTypes.func.isRequired,
  rowCount: PropTypes.number,
  searchOperator: PropTypes.string.isRequired,
  searchValue: PropTypes.string,
  visibleRowCount: PropTypes.number,
};

ResetFiltersMenu.propTypes = {
  hasMaps: SearchBox.propTypes.hasMaps,
  hasNetworks: SearchBox.propTypes.hasNetworks,
  hasTimelines: SearchBox.propTypes.hasTimelines,
  hasTrees: SearchBox.propTypes.hasTrees,
  onResetAllFilters: SearchBox.propTypes.onResetAllFilters,
  onResetMapFilters: SearchBox.propTypes.onResetMapFilters,
  onResetNetworkFilters: SearchBox.propTypes.onResetNetworkFilters,
  onResetTableFilters: SearchBox.propTypes.onResetTableFilters,
  onResetTimelineFilters: SearchBox.propTypes.onResetTimelineFilters,
  onResetTreeFilters: SearchBox.propTypes.onResetTreeFilters,
};

export default SearchBox;
