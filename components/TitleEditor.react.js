import React from "react";
import cc from "classcat";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";

import styles from "../styles/title-editor.module.css";

function TitleEditor(props) {
  return (
    <React.Fragment>
      <span
        className={
          cc([
            "mr-title-editor",
            styles.root,
            props.isReadOnly ? styles.readonly : undefined,
          ])
        }
      >
        { props.value }
        {
          !props.isReadOnly && (
            <DebounceInput
              className={styles.input}
              value={props.value}
              debounceTimeout={1000}
              onChange={(e) => props.onChange(e.target.value)}
            />
          )
        }
      </span>
    </React.Fragment>
  );
}

TitleEditor.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default TitleEditor;
