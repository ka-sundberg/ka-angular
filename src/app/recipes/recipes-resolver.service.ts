import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as recipeActions from "../recipes/store/recipe.actions";
import { take } from "rxjs/operators";
@Injectable({ providedIn: "root" })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private recipesService: RecipeService,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipesService.getRecipes();

    if (recipes.length === 0) {
      this.store.dispatch(new recipeActions.FetchRecipes());
      return this.actions$.pipe(ofType(recipeActions.SET_RECIPES), take(1));
      // return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
