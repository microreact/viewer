// import { configure } from "react-hotkeys";

import { isMac } from "./browser";

// configure({
//   customKeyCodes: {
//     [isMac ? "meta" : "ctrl"]: "CommandKey",
//   },
// });

export const CommandKey = isMac() ? "Cmd" : "Ctrl";

export const keyMap = {
  undo: {
    name: "Undo",
    sequence: "meta+z",
    description: isMac() ? "Cmd+Z" : "Ctrl+Z",
  },
  redo: {
    name: "Redo",
    sequences: isMac() ? "meta+shift+z" : [ "ctrl+shift+z", "ctrl+y" ],
    description: isMac() ? "Cmd + Shift + Z" : "Ctrl + Shift + Z or Ctrl + Y",
  },
};
