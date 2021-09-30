import React from "react";

export default (
  <kbd title="Ctrl key on PC, or Cmd key on Mac.">
    { (navigator.platform.toUpperCase().indexOf("MAC") >= 0) ? "Cmd" : "Ctrl" }
  </kbd>
);
