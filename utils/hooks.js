import { useDispatch, useSelector } from "react-redux";
import { presentStateSelector } from "./state";
import chartStateSelector from "../selectors/charts/chart-state";

export const useAppDispatch = useDispatch;

export const useAppSelector = useSelector;

export const usePresentSelector = (baseSelector, ...args) => {
  return (
    useSelector(
      (rootState) => baseSelector(presentStateSelector(rootState), ...args)
    )
  );
};

// export const useChartStateSelector = (selector, chartId) => {
//   return (
//     usePresentSelector(
//       (presentState) => selector(
//         chartStateSelector(
//           presentState,
//           chartId,
//         )
//       )
//     )
//   );
// };

export const useChartStateSelector = (selector, chartId) => {
  return (
    useSelector(
      (rootState) => selector(
        chartStateSelector(
          presentStateSelector(rootState),
          chartId,
        )
      )
    )
  );
};
