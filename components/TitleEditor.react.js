import React from "react";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";
import styles from "../styles/title-editor.module.css";

const KeyCode = {
  "ESC": 27,
  "ENTER": 13,
};

function TitleEditor(props) {
  const defaultTitle = props.value;
  const inputRef = React.useRef();
  const [ value, setValue ] = React.useState(props.value);

  function onKeyDown(e) {
    console.log("onKeyDown")
    // on pressing enter key the text gets updated in the redux-state
    if (e.keyCode === KeyCode.ENTER) {
      inputRef.current.blur();
      props.onChange(value);
    }

    // on pressing esc updates to the previous stored redux state and default mode.
    if (e.keyCode === KeyCode.ESC) {
      // inputRef.current.blur();
      props.onChange(defaultTitle);
    }

    e.stopPropagation();
  }

  function onBlur(e) {
    console.log("onBlur", e)
    props.onChange(value);
  }

  // const titleWidth = text?.length || 10;
  return (
    // <div className={styles.container}>
      <input
        className={styles.editTextInput}
        // style={{ width: `${titleWidth}ch` }}
        value={value}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
      />
    // </div>
  );
}

TitleEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default React.memo(
  (props) => {
    return (
      <TitleEditor
        key={props.value}
        {...props}
      />
    );
  },
);
