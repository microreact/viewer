const fileContentSelector = (
  (state, fileId) => state.files[fileId]?._content
);

export default fileContentSelector;
