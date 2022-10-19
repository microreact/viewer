import React from "react";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";

const KeyCode = {
  "ESC": 27,
  "ENTER": 13,
};
import styles from "../styles/title-editor.module.css";

function TitleEditor(props) {
  const defaultTitle = props.meta.name;
  const inputRef = React.useRef();
  const [text, setText] = React.useState(defaultTitle);

  function onKeyDown(e) {
    // on pressing enter key the text gets updated in the redux-state
    if (e.keyCode === KeyCode.ENTER) {
      inputRef.current.blur();
      props.onSaveText(text);
    }

    // on pressing esc updates to the previous stored redux state and default mode.
    if (e.keyCode === KeyCode.ESC) {
      inputRef.current.blur();
      setText(defaultTitle);
    }
  }

  return (
     <DebounceInput
      className={styles.editTextInput}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      onChange={(e) => setText(e.target.value)}
      dir={"ltr"}
      />
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
  );
}

TitleEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default TitleEditor;
