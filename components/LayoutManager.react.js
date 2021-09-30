import React from "react";
import PropTypes from "prop-types";
import FlexLayout from "flexlayout-react";
import classnames from "classnames";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

import "../css/panes.css";

import { componentLoader } from "../utils/components";
import { nextTick, nextFrame } from "../utils/browser";
import { editableComponents } from "../constants";

import UiSpinningLoader from "./UiSpinningLoader.react";

const closeIcon = (<CloseRoundedIcon />);

const modelActionLabels = {
  FlexLayout_AddNode: "Add pane",
  FlexLayout_MoveNode: "Move pane",
  FlexLayout_DeleteTab: "Close pane",
  FlexLayout_RenameTab: "Rename pane",
  // FlexLayout_SelectTab: "Select pane",
  // FlexLayout_SetActiveTabset: "Set active paneset",
  FlexLayout_AdjustSplit: "Resize panes",
  FlexLayout_AdjustBorderSplit: "Resize panes",
  FlexLayout_MaximizeToggle: "Maximize pane",
  // FlexLayout_UpdateModelAttributes: "Update model attributes",
  // FlexLayout_UpdateNodeAttributes: "Update pane attributes",
  // FlexLayout_FloatTab: "Float pane",
  // FlexLayout_UnFloatTab: "Un float pane",
};

class DynamicPane extends React.PureComponent {

  state = {
    PaneComponent: null,
  }

  componentDidMount() {
    const componentName = this.props.node.getComponent();

    this.props.fetchComponent(componentName)
      .then(([ PaneComponent, done ]) => {
        this.setState(
          { PaneComponent },
          () => setTimeout(done, 0),
        );
      });

  }

  render() {
    const { props, state } = this;
    const { PaneComponent } = state;

    if (PaneComponent) {
      const component = props.node.getComponent();
      const rect = props.node.getRect();
      const paneId = `${component.toLowerCase()}Id`;
      return (
        <PaneComponent
          { ...{ [paneId]: props.node._attributes.id } }
          height={rect.height}
          width={rect.width}
        />
      );
    }
    else {
      return (
        <UiSpinningLoader />
      );
    }
  }

}

DynamicPane.propTypes = {
  fetchComponent: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
};

class LayoutManager extends React.PureComponent {

  state = {
  }

  elRef = React.createRef()

  queue = []

  fetchComponent = (componentName) => {
    return new Promise((resolve) => {
      const componentPromise = componentLoader(componentName);
      this.queue.push({ promise: componentPromise, callback: resolve });
      if (this.queue.length === 1) {
        nextTick(this.dequeue);
      }
    });
  }

  dequeue = () => {
    const request = this.queue.shift();
    if (request) {
      request.promise.then(
        (componentModule) => request.callback([ componentModule, this.dequeue ])
      );
    }
  }

  componentFactory = (node) => {
    if (
      // node._attributes.enableDrag === false
      // &&
      !node._visible
    ) {
      return null;
    }
    return (
      <DynamicPane
        fetchComponent={this.fetchComponent}
        node={node}
      />
    );
  }

  componentDidMount() {
    window.MicroreactViewerPanes = this.elRef;

    this.props.onLayoutModelChange(this.props.layoutModel);

    window.addEventListener("resize", this.updateRect);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.layoutModel !== this.props.layoutModel && prevProps.layoutModel && this.props.layoutModel) {
  //     const rect = prevProps.layoutModel._borderRects.outer;
  //     relayoutModel(this.props.layoutModel, rect);
  //   }
  // }

  componentWillUnmount() {
    window.MicroreactViewerPanes = undefined;

    window.removeEventListener("resize", this.updateRect);
  }

  updateRect = () => {
    this.props.onLayoutModelChange(this.props.layoutModel);
  }

  // eslint-disable-next-line consistent-return
  handleModelAction = (action) => {
    this.props.layoutModel.actionLabel = modelActionLabels[action.type];

    if (action.type === FlexLayout.Actions.ADD_NODE && action.data.json.new === true) {
      const { component } = action.data.json;
      const { payload } = this.props.onAddView(component);
      action.data.json = {
        id: payload.paneId,
        type: "tab",
        name: component,
        component,
      };
      this.props.layoutModel.actionLabel = `Add ${component} pane`;
      if (editableComponents.includes(component)) {
        nextFrame(() => this.props.onEditPane(payload.paneId));
      }
    }

    if (action.type === FlexLayout.Actions.SELECT_TAB) {
      const tabNode = this.props.layoutModel.getNodeById(action.data.tabNode);
      if (tabNode._visible) {
        if (tabNode.getParent()._attributes.type === "border") {
          tabNode.getParent()._setSelected(-1);
          nextTick(() => this.props.onLayoutModelChange(this.props.layoutModel));
        }
        return;
      }
    }

    // Ignore set active tabset action as we do not use active tabs
    if (action.type === FlexLayout.Actions.SET_ACTIVE_TABSET) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return action;
  }

  classNameMapper = (defaultClassName) => {
    if (defaultClassName === "flexlayout__layout") {
      return classnames(
        "flexlayout__layout",
        "mr-panes",
      );
    }
    else {
      return defaultClassName;
    }
  }

  render() {
    return (
      <FlexLayout.Layout
        classNameMapper={this.classNameMapper}
        factory={this.componentFactory}
        model={this.props.layoutModel}
        onAction={this.handleModelAction}
        onModelChange={this.props.onLayoutModelChange}
        ref={this.elRef}
        popoutURL="/popout.html"
        icons={
          {
            close: closeIcon,
          }
        }
      />
    );
  }

}

LayoutManager.displayName = "Panes";

LayoutManager.propTypes = {
  layoutModel: PropTypes.object.isRequired,
  onAddView: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onLayoutModelChange: PropTypes.func.isRequired,
};

export default LayoutManager;
