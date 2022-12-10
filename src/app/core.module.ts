import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptor } from "./auth/auth-intercepor";
import { LoggingService } from "./logging.service";
import { RecipeService } from "./recipes/recipe.service";

@NgModule({
  providers: [
    // LoggingService,
    RecipeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {}
