import * as FlexLayout from "flexlayout-react";

import { publish } from "./events";

const metrics = {
  borderBarSize: 20,
  headerBarSize: 20,
  tabBarSize: 20,
};

function addTab(label, tab) {
  publish(
    "add-new-pane",
    [
      label,
      tab,
    ],
  );
}

function cloneModel(model) {
  return (
    FlexLayout.Model.fromJson(
      model.toJson()
    )
  );
}

function findTabSetNodeId(model) {
  for (const node of Object.values(model._idMap)) {
    if (node._attributes.type === "tabset") {
      return node._attributes.id;
    }
  }
  return undefined;
}

export function relayoutModel(model, rect) {
  model._layout(
    new FlexLayout.Rect(
      0,
      0,
      window.innerWidth,
      window.innerHeight - 48,
    ),
    // new FlexLayout.Rect(rect.x, rect.y, rect.width, rect.height)
    metrics,
  );
}

export function selectBorderTab(model, tabComponentName) {
  const json = model.toJson();
  json.borders[0].selected = (
    json.borders[0].children.findIndex((x) => x.component === tabComponentName)
  );
  const newModel = FlexLayout.Model.fromJson(json);
  return newModel;
}

export function removeTabFromModel(model, tabId) {
  const newModel = cloneModel(model);
  newModel.doAction(
    FlexLayout.Actions.deleteTab(tabId)
  );
  return newModel;
}

export function createNewTab(component) {
  addTab(
    `Drag to add new ${component}`,
    {
      new: true,
      component,
    }
  );
}

// export function reopenPaneTab(paneId, name, component) {
//   addTab(
//     `Drag to add ${name}`,
//     {
//       id: paneId,
//       type: "tab",
//       name,
//       component,
//     }
//   );
// }

export function addMissingPaneTabs(model, orphanPanes) {
  const newModel = cloneModel(model);
  const tabsetNodeId = findTabSetNodeId(model);
  for (const { paneId, label, component } of orphanPanes) {
    newModel.doAction(
      FlexLayout.Actions.addNode(
        {
          id: paneId,
          type: "tab",
          name: label,
          component,
        },
        tabsetNodeId,
        FlexLayout.DockLocation.CENTER,
        -1,
      ),
    );
  }

  return newModel;
}
