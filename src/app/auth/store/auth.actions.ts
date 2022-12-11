import { Action } from "@ngrx/store";

export const AUTHENTICATE_SUCCESS = "[Auth] LOGIN";
export const LOGOUT = "[Auth] LOGOUT";
export const LOGIN_START = "[Auth] Login start";
export const AUTHENTICATE_FAIL = "[Auth] Login fail";
export const SIGNUP_START = "[Auth] START SIGNUP";
export const CLEAR_ERROR = "[Auth] Clear error";
export const AUTO_LOGIN = "[Auth] Auto login";
// export const SIGNUP = "[Auth] SIGNUP";

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}
export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}
export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}
export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}
export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}
export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | ClearError
  | AutoLogin;
