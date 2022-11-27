import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { LoggingService } from "./logging.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private loggingService: LoggingService
  ) {}
  ngOnInit(): void {
    this.auth.autoLogin();
    this.loggingService.printLog("log from app component");
  }
  loadedFeature = "recipe";

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
