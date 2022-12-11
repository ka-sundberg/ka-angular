import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthService } from "./auth/auth.service";
import { LoggingService } from "./logging.service";
import * as fromApp from "./store/app.reducer";
import * as authActions from "./auth/store/auth.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    this.store.dispatch(new authActions.AutoLogin());
    this.loggingService.printLog("log from app component");
  }
  loadedFeature = "recipe";

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
