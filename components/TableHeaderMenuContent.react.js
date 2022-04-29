import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";
import SortByAlphaRoundedIcon from "@material-ui/icons/SortByAlphaRounded";
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { mdiArrowExpandHorizontal } from "@mdi/js";
import Box from "@material-ui/core/Box";

import "../css/table-column-controls.css";

import { DataColumn, DataFilter, ReactRef, TableColumn } from "../utils/prop-types";

import MdiIcon from "./MdiIcon.react";
import { triggerWindowResize, nextTick } from "../utils/browser";

import DataColumnFilterByValues from "../containers/DataColumnFilterByValues.react";
import SortByAlphaInverseRoundedIcon from "./SortByAlphaInverseRoundedIcon.react";

const operatorsByFieldDataType = {
  text: [
    (<MenuItem value="equals" key="equals">Text is equal to</MenuItem>),
    (<MenuItem value="not-equals" key="not-equals">Text is not equal to</MenuItem>),
    (<MenuItem value="includes" key="includes">Text contains</MenuItem>),
    (<MenuItem value="excludes" key="excludes">Text does not contain</MenuItem>),
    (<MenuItem value="starts-with" key="starts-with">Text starts with</MenuItem>),
    (<MenuItem value="not-starts-with" key="not-starts-with">Text does not start with</MenuItem>),
    (<MenuItem value="ends-with" key="ends-with">Text ends with</MenuItem>),
    (<MenuItem value="not-ends-with" key="not-ends-with">Text does not end with</MenuItem>),
    (<MenuItem value="regex" key="regex">Matches a regular expression</MenuItem>),
    (<MenuItem value="not-regex" key="not-regex">Does not match a regular expression</MenuItem>),
  ],
  number: [
    (<MenuItem value="greater-than" key="greater-than">Greater than</MenuItem>),
    (<MenuItem value="greater-than-or-equal" key="greater-than-or-equal">Greater than or equal to</MenuItem>),
    (<MenuItem value="less-than" key="less-than">Less than</MenuItem>),
    (<MenuItem value="less-than-or-equal" key="less-than-or-equal">Less than or equal to</MenuItem>),
    (<MenuItem value="between" key="between">Is between</MenuItem>),
    (<MenuItem value="not-between" key="not-between">Is not between</MenuItem>),
  ],
};
operatorsByFieldDataType.date = operatorsByFieldDataType.number;

class TableHeaderMenuContent extends React.PureComponent {

  state = {
    conditionOperator: (this.props.filter && this.props.filter.operator !== "in") ? this.props.filter.operator : undefined,
    conditionValue: (this.props.filter && this.props.filter.operator !== "in") ? this.props.filter.value : undefined,
    expandedSection: (this.props.filter && this.props.filter.operator !== "in") ? "condition" : "values",
  }

  componentDidMount() {
    this.inputEL.current.focus();
  }

  inputEL = React.createRef();

  handleConditionOperatorChange = (event) => {
    nextTick(() => this.inputEL.current.focus());
    this.setState({
      conditionOperator: event.target.value,
      conditionValue: this.state.conditionValue,
    });
  }

  handleConditionValueChange = (event) => {
    const conditionValue = this.state.conditionValue ? [ ...this.state.conditionValue ] : [];
    conditionValue[parseInt(event.target.name, 10)] = event.target.value;
    this.setState({ conditionValue });
  }

  handleAccordionChange = (section, isExpanded) => {
    this.setState({ expandedSection: isExpanded ? section : false });
    triggerWindowResize(128);
  }

  handleApplyFilter = (event) => {
    event.preventDefault();
    this.props.onColumnFilterChange(
      this.props.tableColumn.field,
      this.state.conditionOperator,
      this.state.conditionValue
    );
    this.setState({ isOpen: false });
    this.closeMenu();
  }

  handleClearFilter = () => {
    this.props.onColumnFilterChange(
      this.props.tableColumn.field,
      null,
      null,
    );
    this.setState({ isOpen: false });
  }

  handleFilterByValuesChange = (selection) => {
    this.props.onColumnFilterChange(
      this.props.tableColumn.field,
      selection.length ? "in" : null,
      selection,
    );
  }

  closeMenu = () => {
    this.props.menuRef?.current.close();
  }

  sortBy = (event, direction) => {
    this.props.onColumnSort(
      this.props.tableColumn.field,
      direction,
    );
  }

  render() {
    const { props } = this;

    const valuesFilter = (props.filter && props.filter.operator === "in") ? props.filter : undefined;
    const conditionFilter = (props.filter && props.filter.operator !== "in") ? props.filter : undefined;
    const isMultiValue = (this.state.conditionOperator === "between" || this.state.conditionOperator === "not-between");

    return (
      <div
        className="mr-table-column-controls"
      >
        {
          !props.filtersOnly && (
            <React.Fragment>
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                style={{ marginBottom: 4 }}
                className="mr-action-buttons"
              >

                <IconButton
                  onClick={() => this.props.onColumnHide(this.props.tableColumn.field)}
                  size="small"
                  title="Hide this column"
                >
                  <VisibilityOffTwoToneIcon />
                </IconButton>

                <IconButton
                  onClick={() => this.props.onColumnExpand(this.props.tableColumn.field)}
                  size="small"
                  title="Expand this column"
                >
                  <MdiIcon >{ mdiArrowExpandHorizontal }</MdiIcon>
                </IconButton>
              </Box>

              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                style={{ marginBottom: 4 }}
              >
                Sort
                <ToggleButtonGroup
                  size="small"
                  value={this.props.tableColumn.sort}
                  exclusive
                  onChange={this.sortBy}
                >
                  <ToggleButton
                    value="asc"
                    title="Sort by ascending order"
                  >
                    <SortByAlphaRoundedIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton
                    value="desc"
                    title="Sort by decreasing order"
                  >
                    <SortByAlphaInverseRoundedIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/*
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                style={{ marginBottom: 4 }}
              >
                Data type
                <ToggleButtonGroup
                  size="small"
                  value={this.props.dataColumn.category}
                  exclusive
                  // onChange={this.sortBy}
                >
                  <ToggleButton
                    value="text"
                    title="Change data type to Text"
                  >
                    <MdiIcon fontSize="small" >{ mdiAlphabetical }</MdiIcon>
                  </ToggleButton>
                  <ToggleButton
                    value="number"
                    title="Change data type to Number"
                  >
                    <MdiIcon fontSize="small" >{ mdiNumeric }</MdiIcon>
                  </ToggleButton>
                  <ToggleButton
                    value="date"
                    title="Change data type to Date"
                  >
                    <MdiIcon fontSize="small" >{ mdiCalendarClock }</MdiIcon>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              */}
            </React.Fragment>
          )
        }

        <Accordion
          className="mr-filter-by-condition"
          expanded={this.state.expandedSection === "condition"}
          elevation={0}
          onChange={(event, isExpanded) => this.handleAccordionChange("condition", isExpanded)}
        >
          <AccordionSummary
            expandIcon={<PlayArrowIcon />}
            aria-label="Expand"
          >
            <Typography>Filter by condition</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              alignItems="stretch"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <TextField
                select
                label="Condition"
                value={this.state.conditionOperator || ""}
                onChange={this.handleConditionOperatorChange}
                variant="outlined"
                size="small"
              >
                { operatorsByFieldDataType[props.tableColumn.dataType] }
              </TextField>

              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                style={{ margin: "8px 0" }}
              >
                <TextField
                  inputRef={this.inputEL}
                  value={this.state.conditionValue?.[0] || ""}
                  onChange={this.handleConditionValueChange}
                  variant="outlined"
                  size="small"
                  label={isMultiValue ? "From" : "Value"}
                  type={props.tableColumn.dataType}
                  name="0"
                  style={{ width: "100%" }}
                />
                {
                  isMultiValue && (
                    <TextField
                      value={this.state.conditionValue?.[1] || ""}
                      onChange={this.handleConditionValueChange}
                      variant="outlined"
                      size="small"
                      label="To"
                      type={props.tableColumn.dataType}
                      style={{ marginLeft: 8, width: "100%" }}
                      name="1"
                    />
                  )
                }
              </Box>

              <Box
                alignItems="center"
                display="flex"
                flexDirection="row-reverse"
                justifyContent="space-between"
              >
                <Button
                  color="primary"
                  onClick={this.handleApplyFilter}
                  disabled={!this.state.conditionOperator || !this.state.conditionValue}
                >
                  Apply filter
                </Button>
                {
                  !!conditionFilter && (<Button onClick={this.handleClearFilter}>Clear</Button>)
                }
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion
          elevation={0}
          onChange={(event, isExpanded) => this.handleAccordionChange("values", isExpanded)}
          expanded={this.state.expandedSection === "values"}
        >
          <AccordionSummary
            expandIcon={<PlayArrowIcon />}
            aria-label="Expand"
          >
            <Typography>Filter by values</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DataColumnFilterByValues
              field={props.tableColumn.field}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

}

TableHeaderMenuContent.displayName = "TableHeaderMenuContent";

TableHeaderMenuContent.propTypes = {
  filter: DataFilter,
  menuRef: ReactRef,
  onColumnExpand: PropTypes.func.isRequired,
  onColumnFilterChange: PropTypes.func.isRequired,
  onColumnHide: PropTypes.func.isRequired,
  onColumnSort: PropTypes.func.isRequired,
  tableColumn: TableColumn,
};

export default TableHeaderMenuContent;
