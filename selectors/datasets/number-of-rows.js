import rowsSelector from "./rows";

const numberOfRowsSelector = (state) => {
  const rows = rowsSelector(state);
  return rows ? rows.length : 0;
};

export default numberOfRowsSelector;
