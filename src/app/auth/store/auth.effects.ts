import { HttpClient } from "@angular/common/http";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import * as authActions from "./auth.actions";
import { environment } from "../../../environments/environment";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  handleAuthentication = (resData) => {
    const expirationDate = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      expirationDate
    );
    localStorage.setItem("userData", JSON.stringify(user));
    return new authActions.AuthenticateSuccess({
      email: resData.email,
      userId: resData.localId,
      token: resData.idToken,
      expirationDate: expirationDate,
    });
  };
  handleError = (errorRes) => {
    let errorMessage = "An unknown error occurred!";
    if (!errorRes.error || !errorRes.error.error) {
      return of(new authActions.AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email exists already";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This email does not exist.";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "This password is not correct.";
        break;
    }
    return of(new authActions.AuthenticateFail(errorMessage));
  };

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(authActions.SIGNUP_START),
    switchMap((signupAction: authActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            environment.apiKey,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((resData) => {
            return this.handleAuthentication(resData);
          }),
          catchError((errorRes) => {
            return this.handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(authActions.LOGIN_START),
    switchMap((authData: authActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
            environment.apiKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((resData) => {
            const expirationDate = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            );
            return this.handleAuthentication(resData);
          }),
          catchError((errorRes) => {
            return this.handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(authActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(["/"]);
    })
  );
  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(authActions.LOGOUT),
    tap((x) => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem("userData");
      this.router.navigate(["/auth"]);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(authActions.AUTO_LOGIN),
    map(() => {
      const user = localStorage.getItem("userData");
      if (!user) return { type: "Dummy" };
      const newUser: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(user);
      const loadedUser = new User(
        newUser.email,
        newUser.id,
        newUser._token,
        new Date(newUser._tokenExpirationDate)
      );
      if (loadedUser.token) {
        const expirationDuration =
          new Date(newUser._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new authActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(newUser._tokenExpirationDate),
        });

        // this.autoLogout(exp);
      }
      return { type: "Dummy" };
    })
  );
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
