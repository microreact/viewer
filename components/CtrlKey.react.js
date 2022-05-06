import React from "react";
import { isMac } from "../utils/browser";

export default (
  <kbd title="Ctrl key on PC, or Cmd key on Mac.">
    { isMac() ? "Cmd" : "Ctrl" }
  </kbd>
);
