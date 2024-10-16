import PropTypes from "prop-types";
import React from "react";
import cc from "classcat";
import Button from "@mui/material/Button";

import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import numberOfFilteredRowsSelector from "../selectors/filters/number-of-filtered-rows.js";

import styles from "../styles/empty-search-message.module.css";
import { setSearchValue } from "../actions/filters.js";

function EmptySearchMessage() {
  const dispatch = useAppDispatch();

  const handleResetSearchValue = (controls) => {
    dispatch(setSearchValue(""));
  };

  const filteredRowCount = usePresentSelector(numberOfFilteredRowsSelector);

  const searchValue = usePresentSelector((state) => state.filters.searchValue);

  if (filteredRowCount === 0 && !!searchValue) {
    return (
      <div
        className={
          cc([
            "mr-empty-search-message",
            styles.root,
          ])
        }
      >
        Your search returned no entries
        &nbsp;
        <Button
          onClick={handleResetSearchValue}
          variant="outlined"
        >
          Reset filter
        </Button>
      </div>
    );
  }

  return null;
}

EmptySearchMessage.propTypes = {
  chartId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default EmptySearchMessage;
