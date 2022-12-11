import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder.directive";
import * as fromApp from "../store/app.reducer";
import * as authActions from "./store/auth.actions";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnDestroy, OnInit {
  constructor(
    private componentResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  private storeSub: Subscription;
  ngOnInit(): void {
    this.storeSub = this.store.select("auth").subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (authState.authError) this.showError(authState.authError);
    });
  }
  ngOnDestroy(): void {
    if (this.storeSub) this.storeSub.unsubscribe();
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
    this.store.dispatch(new authActions.ClearError());

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

    if (this.isLoginMode) {
      this.store.dispatch(
        new authActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.store.dispatch(
        new authActions.SignupStart({ email: email, password: password })
      );
    }
  }
}
