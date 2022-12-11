import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";

import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from "../store/app.reducer";
import * as authActions from "../auth/store/auth.actions";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;
  constructor(
    private dataStorageService: DataStorageService,
    private auth: AuthService,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  ngOnInit(): void {
    this.userSub = this.store
      .select("auth")
      .pipe(map((x) => x.user))
      .subscribe((x) => {
        this.isAuthenticated = !!x;
      });
  }
  Logout() {
    // this.auth.logout();
    this.store.dispatch(new authActions.Logout());
  }
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
