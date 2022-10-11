import React from "react";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";
import styles from "../styles/title-editor.module.css";

const KeyCode = {
  "ESC": 27,
  "ENTER": 13,
};

function TitleEditor(props) {
  const { meta, onSaveText } = props;
  const defaultTitle = meta.name;
  const [editMode, setEditMode] = React.useState(false);
  const [text, setText] = React.useState(defaultTitle);

  function onKeyDown(e) {
    // on pressing enter key the text gets updated in the redux-state
    if (e.keyCode === KeyCode.ENTER) {
      onSaveText(text);
      setEditMode(false);
    }

    // on pressing esc updates to the previous stored redux state and default mode.
    if (e.keyCode === KeyCode.ESC) {
      setEditMode(false);
      setText(defaultTitle);
    }
  }

  return (
    <div className={styles.container}>
        { editMode
          ? <DebounceInput
                className={styles.editTextInput}
                value={text}
                onKeyDown={onKeyDown}
                onChange={(e) => setText(e.target.value)}
                autoFocus={true}
                />
          : <div className={styles.title} onClick={() => setEditMode(!editMode)}>
            {defaultTitle}
            </div>
            }
    </div>
  );
}

TitleEditor.propTypes = {
  onSaveText: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
};

export default TitleEditor;
