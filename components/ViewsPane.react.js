import PropTypes from "prop-types";
import React from "react";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import CircularProgress from "@material-ui/core/CircularProgress";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HashChange from "react-hashchange";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

import "@sweetalert2/theme-material-ui/material-ui.css";

import "../css/views-pane.css";

import * as BrowserUtils from "../utils/browser";

import UiEmptyState from "./UiEmptyState.react";
import UiIconButton from "./UiIconButton.react";
import UiSidePaneHeader from "./UiSidePaneHeader.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiControlsButton from "./UiControlsButton.react";
import { swap } from "../utils/arrays";
import { getContainerElement } from "../utils/html";

// const MySwal = withReactContent(Swal);

const SortableItem = sortableElement(
  (props) => {
    return (
      <li
        key={props.item.meta.id}
        className={props.currentViewId?.startsWith(props.item.meta.id) ? "mr-views-item mr-selected" : "mr-views-item"}
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
            onClick={() => props.onSetDefaultView(props.item)}
          >
            Set as Default View
          </UiDropdownMenu.Item>
          <UiDropdownMenu.Item
            onClick={() => props.onResaveView(props.item)}
          >
            Update View
          </UiDropdownMenu.Item>
          <UiDropdownMenu.Item
            onClick={() => props.onDeleteView(props.item)}
          >
            Delete View
          </UiDropdownMenu.Item>
          {/*
          <UiDropdownMenu.Item
            onClick={() => props.onDownloadView(item)}
          >
            Download as <code>.microreact</code>
          </UiDropdownMenu.Item>
          */}
        </UiDropdownMenu>
        <button
          className="mr-view-button"
          onClick={() => props.onLoadView(props.item)}
        >
          <img src={props.item.meta.image} />
          <span>
            { props.item.isDefault ? "✅ " : "" }
            { props.item.meta.name }
          </span>
        </button>
      </li>
    );
  }
);

SortableItem.displayName = "ViewListItem";

SortableItem.propTypes = {
  item: PropTypes.object.isRequired,
  onRenameView: PropTypes.func.isRequired,
  onResaveView: PropTypes.func.isRequired,
  // onDownloadView: PropTypes.func.isRequired,
};

// const SortableItem = SortableElement(
//   (props) => {
//     return (
//       <li
//         // className={props.currentViewId.startsWith(props.item.id) ? "mr-selected" : null}
//         className="mr-views-item"
//       >
//         <UiDropdownMenu
//           button={UiControlsButton}
//           icon={<MoreVertIcon />}
//         >
//           <UiDropdownMenu.Item
//             onClick={() => props.onRenameView(props.item)}
//           >
//             Rename View
//           </UiDropdownMenu.Item>

//           <UiDropdownMenu.Item
//             onClick={() => props.onResaveView(props.item)}
//           >
//             Update View
//           </UiDropdownMenu.Item>
//           <UiDropdownMenu.Item
//             onClick={() => props.onDownloadView(props.item)}
//           >
//             Download as <code>.microreact</code>
//           </UiDropdownMenu.Item>
//         </UiDropdownMenu>
//         <button
//           className="mr-view-button"
//           // onClick={() => props.onLoadView(props.item)}
//         >
//           <img src={props.item.image} />
//           <span>
//             { props.item.name }
//           </span>
//         </button>
//       </li>
//     );
//   }
// );

const SortableList = sortableContainer(
  (props) => {
    return (
      <ul>
        {
          props.items.map((item, index) => {
            return (
              <SortableItem
                index={index}
                key={item.meta.id}
                item={item}
                currentViewId={props.currentViewId}
                onRenameView={props.onRenameView}
                onResaveView={props.onResaveView}
                onSetDefaultView={props.onSetDefaultView}
                // onDownloadView={props.onDownloadView}
                onDeleteView={props.onDeleteView}
                onLoadView={props.onLoadView}
              />
            );
          })
        }
      </ul>
    );
  },
);

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

  handleRenameView = async (item) => {
    const { props } = this;

    const { value } = await Swal.fire({
      // title: "Rename View",
      input: "text",
      inputValue: item.meta.name,
      inputLabel: "Enter view title",
      showCancelButton: true,
      confirmButtonText: "Rename",
    });

    if (value) {
      props.onRenameView(item, value);
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

  renderList = ({ hash }) => {
    const { props, state } = this;

    const currentViewId = BrowserUtils.getPageHash(hash);

    return (
      <ul>
        {
          state.isSaving && (
            <li className="mr-views-item">
              <CircularProgress
                size={80}
                thickness={1}
              />
            </li>
          )
        }
        <SortableList
          currentViewId={currentViewId}
          items={props.entries}
          // onDownloadView={props.onDownloadView}
          onLoadView={props.onLoadView}
          onDeleteView={props.onDeleteView}
          onRenameView={this.handleRenameView}
          onResaveView={props.onResaveView}
          onSetDefaultView={props.onSetDefaultView}
          onSortEnd={this.handleSortEnd}
          pressDelay={640}
          helperContainer={getContainerElement}
          helperClass="mr-dragable"
        />
      </ul>
    );
  }

  renderContent = () => {
    const { props, state } = this;

    if (props.entries.length === 0 && !state.isSaving) {
      return (
        <UiEmptyState
          // title="No Views"
          subtitle={props.isReadOnly ? "You cannot add a new view to this project because you are not the owner." : "You can add a new view by clicking the plus button"}
          icon={<ViewCompactIcon />}
        />
      );
    }

    return (
      <HashChange
        render={this.renderList}
      />
    );
  }

  render() {
    const { props, state } = this;
    return (
      <div
        className="mr-views-pane"
        data-html2canvas-ignore="true"
      >
        <UiSidePaneHeader
          onClose={props.onClose}
          title="Views"
        >
          {
            !props.isReadOnly && (
              <UiIconButton
                onClick={this.handleCreateView}
                disabled={state.isSaving}
              >
                <AddCircleTwoToneIcon />
              </UiIconButton>
            )
          }
        </UiSidePaneHeader>

        { this.renderContent() }
      </div>
    );
  }

}

ViewsPane.displayName = "ViewsPane";

ViewsPane.propTypes = {
  entries: PropTypes.array.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateView: PropTypes.func.isRequired,
  onDeleteView: PropTypes.func.isRequired,
  onEntriesListChange: PropTypes.func.isRequired,
  onLoadView: PropTypes.func.isRequired,
  onRenameView: PropTypes.func.isRequired,
  onResaveView: PropTypes.func.isRequired,
};

export default ViewsPane;
