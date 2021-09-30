import { connect } from "react-redux";

import NotePane from "../components/NotePane.react";

import { update } from "../actions/notes";
import noteStateSelector from "../selectors/notes/note-state";
import { query } from "../actions/ui";

const mapStateToProps = (state, { noteId }) => {
  const noteState = noteStateSelector(state, noteId);
  return {
    source: noteState.source,
  };
};

const mapDispatchToProps = (dispatch, { noteId }) => ({
  onQueryChange: (value) => dispatch(query(value)),
  onSourceChange: (value) => dispatch(update(noteId, "source", value)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(NotePane);
