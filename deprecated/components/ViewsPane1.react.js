import PropTypes from "prop-types";
import React from "react";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import CircularProgress from "@material-ui/core/CircularProgress";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HashChange from "react-hashchange";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import "../css/views-pane.css";

import * as BrowserUtils from "../utils/browser";

import UiEmptyState from "./UiEmptyState.react";
import UiIconButton from "./UiIconButton.react";
import UiSidePaneHeader from "./UiSidePaneHeader.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiControlsButton from "./UiControlsButton.react";
import { swap } from "../utils/arrays";

const SortableItem = SortableElement(
  (props) => {
    return (
      <li
        // key={props.item?.meta?.id}
        // className={props.currentViewId.startsWith(props.item?.meta?.id) ? "mr-selected" : null}
        className="mr-views-item"
      >
        <UiDropdownMenu
          button={UiControlsButton}
          icon={<MoreVertIcon />}
        >
          <UiDropdownMenu.Item
            onClick={() => props.onRenameView(props.item)}
          >
            Rename View
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            onClick={() => props.onUpdateView(props.item)}
          >
            Update View
          </UiDropdownMenu.Item>
          <UiDropdownMenu.Item
            onClick={() => props.onDownloadView(props.item)}
          >
            Download as <code>.microreact</code>
          </UiDropdownMenu.Item>
        </UiDropdownMenu>
        <button
          className="mr-view-button"
          // onClick={() => props.onLoadView(props.item)}
        >
          <img src={props.item.image} />
          <span>
            { props.item?.meta?.name }
          </span>
        </button>
      </li>
    );
  }
);

const SortableList = SortableContainer((props) => {
  return (
    <ul>
      {
        props.items.map((item, index) => {
          return (
            <SortableItem
              index={index}
              key={item?.meta?.id}
              item={item}
              currentViewId={props.currentViewId}
              onRenameView={props.onRenameView}
              onUpdateView={props.onUpdateView}
              onDownloadView={props.onDownloadView}
              onLoadView={props.onLoadView}
            />
          );
        })
      }
    </ul>
  );
});

class ViewsPane extends React.PureComponent {

  state = {
    isSaving: false,
  }

  handleCreateView = () => {
    const { props } = this;
    this.setState(
      { isSaving: true },
      props.onCreateView,
    );
  }

  handleRenameView = (item) => {
    const { props } = this;
    const name = window.prompt("Enter view title", item?.meta?.name || "");
    if (name) {
      props.onRenameView(item, name);
    }
  }

  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.props.onEntriesListChange(
      swap(
        this.props.entries,
        oldIndex,
        newIndex,
      )
    );
  };

  renderViewButtons = ({ hash }) => {
    const { props } = this;

    const currentViewId = hash.substr(1);

    return (
      <SortableList
        currentViewId={currentViewId}
        items={props.entries}
        onDownloadView={props.onDownloadView}
        onLoadView={props.onLoadView}
        onRenameView={this.handleRenameView}
        onSortEnd={this.handleSortEnd}
        onUpdateView={props.onUpdateView}
      />
    );
  }

  renderEntries = () => {
    const { props, state } = this;

    if (props.entries.length === 0 && !state.isSaving) {
      return (
        <UiEmptyState
          // title="No Views"
          subtitle="You can add a new saved view by clicking the plus button"
          icon={<ViewCompactIcon />}
        />
      );
    }

    return (
      <HashChange
        render={this.renderViewButtons}
      />
    );
  }

  render() {
    const { props } = this;
    return (
      <div
        className="mr-views-pane"
        data-html2canvas-ignore="true"
      >
        <UiSidePaneHeader
          onClose={props.onClose}
          title="Views"
        >
          <UiIconButton
            onClick={this.handleCreateView}
          >
            <AddCircleTwoToneIcon />
          </UiIconButton>
        </UiSidePaneHeader>

        { this.renderEntries() }
      </div>
    );
  }

}

ViewsPane.displayName = "ViewsPane";

ViewsPane.propTypes = {
  entries: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateView: PropTypes.func.isRequired,
  onLoadView: PropTypes.func.isRequired,
  onRenameView: PropTypes.func.isRequired,
  onUpdateView: PropTypes.func.isRequired,
};

export default ViewsPane;
