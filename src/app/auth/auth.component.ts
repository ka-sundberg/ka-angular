import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnDestroy {
  constructor(
    private authService: AuthService,
    private router: Router,
    private componentResolver: ComponentFactoryResolver
  ) {}
  ngOnDestroy(): void {
    if (this.closeSub) this.closeSub.unsubscribe();
  }

  private closeSub: Subscription;
  @ViewChild(PlaceHolderDirective, { static: false })
  alertHost: PlaceHolderDirective;
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onHandleError() {
    this.error = null;
  }
  private showError(error) {
    const factory =
      this.componentResolver.resolveComponentFactory(AlertComponent);
    const host = this.alertHost.viewcontainerref;
    host.clear();

    const alertRef = host.createComponent(factory);
    alertRef.instance.message = error;
    this.closeSub = alertRef.instance.close.subscribe((x) => {
      this.closeSub.unsubscribe();
      host.clear();
    });
  }
  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      console.log(form);
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(
      (x) => {
        console.log(x);
        this.isLoading = false;
        this.router.navigate(["/recipes"]);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        this.showError(error);
      }
    );

    form.reset();
  }
}
