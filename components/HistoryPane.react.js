import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import React from "react";
import RedoRoundedIcon from "@material-ui/icons/RedoRounded";
import UndoRoundedIcon from "@material-ui/icons/UndoRounded";
import { createSelector } from "reselect";

import "../css/history-pane.css";
import { keyMap } from "../utils/shortcuts";
import PaneIcon from "./PaneIcon.react";
import UiIconButton from "./UiIconButton.react";
import UiSidePaneHeader from "./UiSidePaneHeader.react";

class History extends React.PureComponent {

  entriesSelector = createSelector(
    (props) => props.rootState,
    (rootState) => {
      const entries = [
        ...rootState.past.map((item, index, array) => ({ label: item.config.label, index: (index - array.length) })),
        { label: rootState.present.config.label, index: 0 },
        ...rootState.future.map((item, index, array) => ({ label: item.config.label, index: (index + 1) })),
      ];

      for (const item of entries) {
        const [ source, label ] = item.label.split(": ");
        item.label = label;
        item.source = source;
      }
      return entries.reverse();
    },
  )

  render() {
    const { props } = this;
    const canUndo = props.rootState.past.length > 0;
    const canRedo = props.rootState.future.length > 0;

    return (
      <div className="mr-history-pane">
        <UiSidePaneHeader
          onClose={props.onClose}
          title="Session History"
        >
          <UiIconButton
            disabled={!canUndo}
            onClick={props.onUndo}
            title={`Undo (${keyMap.undo.description})`}
          >
            <UndoRoundedIcon />
          </UiIconButton>
          <UiIconButton
            disabled={!canRedo}
            onClick={props.onRedo}
            title={`Redo (${keyMap.redo.description})`}
          >
            <RedoRoundedIcon />
          </UiIconButton>
        </UiSidePaneHeader>

        <List dense>
        {
            this.entriesSelector(props).map(
              (item) => (
                <ListItem
                  button={item.index !== 0}
                  key={item.index}
                  onClick={() => props.onJump(item.index)}
                  selected={item.index === 0}
                >
                  <ListItemIcon>
                    <PaneIcon component={item.source} />
                  </ListItemIcon>
                  <ListItemText
                    primary={ item.label }
                  />
                </ListItem>
              )
            )
          }
        </List>
      </div>
    );
  }

}

History.displayName = "History";

History.propTypes = {
  onClose: PropTypes.func.isRequired,
  onJump: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  rootState: PropTypes.object.isRequired,
};

export default History;
