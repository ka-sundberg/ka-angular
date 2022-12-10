import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { environment } from "src/environments/environment";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as authActions from "./store/auth.actions";
import { emit } from "process";
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  logoutTimer: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  //   public token: string = null;

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
          environment.apiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handeError),
        tap((respData) => {
          this.handleAuthentication(
            respData.email,
            respData.localId,
            respData.idToken,
            +respData.expiresIn
          );
        })
      );
  }

  autoLogout(expirationDuration: number) {
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    //this.user.next(null);
    this.store.dispatch(new authActions.Logout());
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
  }

  signup(email: string, password: string) {
    console.log("signup");
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
          environment.apiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handeError),
        tap((respData) => {
          this.handleAuthentication(
            respData.email,
            respData.localId,
            respData.idToken,
            +respData.expiresIn
          );
        })
      );
  }
  autoLogin() {
    const user = localStorage.getItem("userData");
    if (!user) return;
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
      this.store.dispatch(
        new authActions.Login({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(newUser._tokenExpirationDate),
        })
      );
      // this.user.next(loadedUser);
      const exp =
        new Date(newUser._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(exp);
    }
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const ionDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, ionDate);
    this.store.dispatch(
      new authActions.Login({
        email: email,
        userId: id,
        token: token,
        expirationDate: ionDate,
      })
    );
    //his.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(user));
  }
  private handeError(errorRes: HttpErrorResponse) {
    let error = "Unkown error occured";
    console.log(errorRes);
    if (!errorRes.error || !errorRes.error.error) return throwError(error);
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        error = "Email exists already";
        break;
      case "EMAIL_NOT_FOUND":
        error = "Email not found";
        break;
      case "INVALID_PASSWORD":
        error = "This password is not correct ";
        break;
    }
    return throwError(error);
  }
}
