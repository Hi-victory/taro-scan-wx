import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState } from "./reducers/index";
import type { AppDispatch } from "./index";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
