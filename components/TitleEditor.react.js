import React from "react";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";

import styles from "../styles/title-editor.module.css";

function TitleEditor(props) {
  return (
    <DebounceInput
      className={styles.editTextInput}
      value={props.value}
      debounceTimeout={1000}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}

TitleEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default TitleEditor;
