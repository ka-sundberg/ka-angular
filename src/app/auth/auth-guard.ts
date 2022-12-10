import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { resolve } from "url";
import { AuthService } from "./auth.service";
import * as froomApp from "../store/app.reducer";
@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<froomApp.AppState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.store.select("auth").pipe(
      take(1),
      map((x) => x.user),
      map((user) => {
        const isAUth = !!user;
        if (isAUth) return true;
        return this.router.createUrlTree(["/auth"]);
      })
    );
  }
}
