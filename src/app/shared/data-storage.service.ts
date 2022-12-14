import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, take, tap } from "rxjs/operators";

import { RecipeService } from "../recipes/recipe.service";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as recipeActions from "../recipes/store/recipe.actions";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.http
      .put(
        "https://ka-angular-default-rtdb.europe-west1.firebasedatabase.app/recipes.json",
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get(
        "https://ka-angular-default-rtdb.europe-west1.firebasedatabase.app/recipes.json"
      )
      .pipe(
        map((recipes) => {
          console.log(recipes);
          return recipes["recipes"].map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) =>
          this.store.dispatch(new recipeActions.SetRecipies(recipes))
        )
      );
  }
}
