import { User } from "src/app/auth/user.model";
import {
  AuthActions,
  AUTHENTICATE_SUCCESS,
  AuthenticateFail,
  AUTHENTICATE_FAIL,
  LOGIN_START,
  LOGOUT,
  SIGNUP_START,
  CLEAR_ERROR,
} from "./auth.actions";

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}
const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};
export function AuthReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return { ...state, user: user, authError: null, loading: false };
    case LOGOUT:
      return { ...state, user: null };
    case LOGIN_START:
    case SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}
