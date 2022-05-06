import React from "react";
import { isMac } from "../utils/browser";

const AltKey = React.memo(() => (
  <kbd title="Shift key on PC, or Alt key on Mac.">
    { isMac() ? "Alt" : "Shift" }
  </kbd>
));

AltKey.displayName = "AltKey";

export default AltKey;
