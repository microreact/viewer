/* eslint-disable consistent-return */
import { nextFrame } from "./browser";

// const dispatch = store.dispatch;
// store.dispatch = function (action) {
//   // const image = document.createElement("img");
//   // // image.src = "/images/logos/icon-spinner.gif";
//   // image.src = "/images/spinner.png";
//   // image.classList.add("microreact-viewer-spinner");
//   // document.body.appendChild(image);

//   // // const handler = setTimeout(
//   // //   () => document.body.appendChild(image),
//   // //   16,
//   // // );

//   // const unsubscribe = store.subscribe(() => {
//   //   // clearTimeout(handler);
//   //   image.remove();
//   //   unsubscribe();
//   // });

//   // dispatch(action)

//   // window.setTimeout(
//   //   () => dispatch(action),
//   //   0,
//   // );

//   // window.setTimeout(
//   //   () => {
//   //     dispatch(action);
//   //     image.remove();
//   //   },
//   //   0,
//   // )

//   if (!action.immediate) {
//     if (document.body.classList.contains("mr-has-loading-spinner")) {
//       dispatch(action);
//     }
//     else {
//       document.body.classList.add("mr-has-loading-spinner");
//       nextFrame(
//         () => {
//           dispatch(action);
//           document.body.classList.remove("mr-has-loading-spinner");
//         }
//       );
//     }
//   }
//   else {
//     dispatch(action);
//   }
// };

export default function delayDispatchMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      if (action.delay || action.type.startsWith("@@redux-undo/")) {
        if (document.body.classList.contains("mr-has-loading-spinner")) {
          return next(action);
        }
        else {
          document.body.classList.add("mr-has-loading-spinner");
          nextFrame(
            () => {
              next(action);
              document.body.classList.remove("mr-has-loading-spinner");
            }
          );
        }
      }
      else {
        return next(action);
      }
    };
  };
}
