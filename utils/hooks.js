import { useDispatch, useSelector } from "react-redux";
import { presentStateSelector } from "./state";

export const useAppDispatch = useDispatch;

export const useAppSelector = useSelector;

export const usePresentSelector = (selector, ...args) => {
  return useSelector((rootState) => selector(presentStateSelector(rootState, ...args)));
};
