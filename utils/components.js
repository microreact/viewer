// import Chart from "../containers/ChartPane.react";
// import History from "../containers/HistoryPane.react";
// import Legend from "../containers/LegendPane.react";
// import Matrix from "../containers/MatrixPlaceholder";
// import Map from "../containers/MapPlaceholder.react";
// import Network from "../containers/NetworkPlaceholder.react";
// import Note from "../containers/NotePane.react";
// import Table from "../containers/TablePlaceholder.react";
// import Timeline from "../containers/TimelinePane.react";
// import Tree from "../containers/TreePlaceholder.react";
// import Views from "../containers/ViewsPane.react";
// import Selection from "../containers/SelectionPane.react";
// export function componentLoader(componentName) {
//   if (componentName === "Chart") { return Promise.resolve(Chart); }
//   if (componentName === "History") { return Promise.resolve(History); }
//   if (componentName === "Legend") { return Promise.resolve(Legend); }
//   if (componentName === "Matrix") { return Promise.resolve(Matrix); }
//   if (componentName === "Map") { return Promise.resolve(Map); }
//   if (componentName === "Network") { return Promise.resolve(Network); }
//   if (componentName === "Note") { return Promise.resolve(Note); }
//   if (componentName === "Table") { return Promise.resolve(Table); }
//   if (componentName === "Timeline") { return Promise.resolve(Timeline); }
//   if (componentName === "Tree") { return Promise.resolve(Tree); }
//   if (componentName === "Views") { return Promise.resolve(Views); }
//   if (componentName === "Selection") { return Promise.resolve(Selection); }
//   throw new Error(`Unknown component ${componentName}`);
// }

export function componentLoader(componentName) {
  if (componentName === "Chart") { return import(/* webpackChunkName: "chart" */ "../containers/ChartPane.react").then((x) => x.default); }
  if (componentName === "History") { return import(/* webpackChunkName: "history" */ "../containers/HistoryPane.react").then((x) => x.default); }
  if (componentName === "Legend") { return import(/* webpackChunkName: "legend" */ "../containers/LegendPane.react").then((x) => x.default); }
  if (componentName === "Matrix") {
    return import(/* webpackChunkName: "catrix" */ "../containers/MatrixPlaceholder.js").then((x) => x.default);
    // return Promise.resolve(Matrix);
  }
  if (componentName === "Map") { return import(/* webpackChunkName: "map" */ "../containers/MapPlaceholder.react").then((x) => x.default); }
  if (componentName === "Network") { return import(/* webpackChunkName: "network" */ "../containers/NetworkPlaceholder.react").then((x) => x.default); }
  if (componentName === "Note") { return import(/* webpackChunkName: "note" */ "../containers/NotePane.react").then((x) => x.default); }
  if (componentName === "Slicer") { return import(/* webpackChunkName: "slicer" */ "../containers/SlicerPlaceholder.react").then((x) => x.default); }
  if (componentName === "Table") { return import(/* webpackChunkName: "table" */ "../containers/TablePlaceholder.react").then((x) => x.default); }
  if (componentName === "Timeline") { return import(/* webpackChunkName: "timeline" */ "../containers/TimelinePlaceholder.react").then((x) => x.default); }
  if (componentName === "Tree") { return import(/* webpackChunkName: "tree" */ "../containers/TreePlaceholder.react").then((x) => x.default); }
  if (componentName === "Views") { return import(/* webpackChunkName: "views" */ "../containers/ViewsPane.react").then((x) => x.default); }
  if (componentName === "Selection") { return import(/* webpackChunkName: "views" */ "../containers/SelectionPane.react").then((x) => x.default); }
  if (componentName === "Empty") { return Promise.resolve(() => "null"); }
  throw new Error(`Unknown component ${componentName}`);
}
