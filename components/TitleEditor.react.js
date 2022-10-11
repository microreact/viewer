import React from "react";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";
import styles from "../styles/title-editor.module.css";

const KeyCode = {
  "ESC": 27,
  "ENTER": 13,
};

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
    <div className={styles.container}>
     <DebounceInput
      className={styles.editTextInput}
      value={text}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}

TitleEditor.propTypes = {
  onSaveText: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
};

export default TitleEditor;
