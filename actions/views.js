import { generateHashId } from "../utils/hash";

import { save } from "./ui";

function createViewDocument(doc) {
  doc.views = undefined;
  doc.files = undefined;
  doc.schema = undefined;
  doc.timestamp = undefined;
  doc.meta = {
    id: generateHashId(),
    name: "Unnamed View",
    image: doc.meta.image,
  };
  return doc;
}

export function createNewView() {
  return (dispatch) => {
    return (
      dispatch(save())
        .then(createViewDocument)
        .then((doc) => {
          return dispatch({
            type: "MICROREACT VIEWER/ADD VIEW",
            payload: doc,
            label: "Project: Add view",
          });
        })
    );
  };
}

export function deleteView(viewDocument) {
  return {
    type: "MICROREACT VIEWER/DELETE VIEW",
    payload: viewDocument,
    label: "Project: Delete view",
  };
}

// export function loadView(viewDocument) {
//   return (dispatch, getState) => {
//     const state = getPresentState(getState());
//     setPageHash(viewDocument.meta.id);
//     return (
//       dispatch(
//         load(
//           {
//             ...viewDocument,
//             files: state.files,
//             meta: state.meta,
//             views: state.views,
//           }
//         )
//       )
//     );
//   };
// }

export function renameView(viewDocument, name) {
  return {
    type: "MICROREACT VIEWER/UPDATE VIEW",
    label: "Project: Rename view",
    payload: {
      ...viewDocument,
      meta: {
        ...viewDocument.meta,
        name,
      },
    },
  };
}

export function setViewsList(viewsList) {
  return {
    type: "MICROREACT VIEWER/SET VIEWS LIST",
    payload: viewsList,
  };
}

export function resaveView(view) {
  return (dispatch) => {
    return (
      dispatch(save())
        .then(createViewDocument)
        .then((doc) => {
          doc.meta.id = view.meta.id;
          doc.meta.name = view.meta.name;
          return dispatch({
            type: "MICROREACT VIEWER/UPDATE VIEW",
            payload: doc,
            label: "Project: Update view",
          });
        })
    );
  };
}
