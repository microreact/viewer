import React from "react";
import styles from "../styles/TextEditor.module.css";

function TextEditor(props) {
  const [editMode, setEditMode] = React.useState(false);
  const [text, setText] = React.useState(props.title);

  console.log("edtiMode", editMode);
  return (
    <div className={styles.container} onClick={() => setEditMode(!editMode)}>
        {editMode ? text : "false"}
    </div>
  );
}

export default TextEditor;
