import { RootState } from "@/store/reducers";
import { useSelector, useDispatch } from "react-redux";
import {
  GLOBAL_REDUCER_NAME,
  saveFirst,
  saveTabIndex,
} from "@/store/reducers/global";
import { getAuth, logout } from "@/utils/Auth";

interface IPageRole {
  tabIndex: number;
  toLogin: () => void;
  isUnAuthorization: boolean;
}

export const useAuthorization = (): IPageRole => {
  const dispatch = useDispatch();

  const { first = true, tabIndex } = useSelector(
    (state: RootState) => state[GLOBAL_REDUCER_NAME]
  );

  const user = getAuth();

  const isUnAuthorization: boolean = first && !user.access_token;

  const toLogin = () => {
    logout();
    dispatch(saveTabIndex(0));
    dispatch(saveFirst(true));
  };
  return { isUnAuthorization, tabIndex, toLogin };
};
