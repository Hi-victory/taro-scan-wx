import { Action, configureStore } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import rootReducer, { RootState } from "./reducers";

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk<T = void> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  Action<string>
>;

export default store;
