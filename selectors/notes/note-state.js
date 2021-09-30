import { initialState } from "../../reducers/notes";

const noteStateSelector = (state, noteId) => state.notes[noteId] || initialState;

export default noteStateSelector;
