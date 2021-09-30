import React from "react";

const AltKey = React.memo(() => (
  <kbd title="Shift key on PC, or Alt key on Mac.">
    { (navigator.platform.toUpperCase().indexOf("MAC") >= 0) ? "Alt" : "Shift" }
  </kbd>
));

AltKey.displayName = "AltKey";

export default AltKey;
