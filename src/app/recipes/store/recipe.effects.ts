import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { switchMap, map } from "rxjs/operators";
import * as recipeActions from "./recipe.actions";
import { Recipe } from "../recipe.model";
import { Injectable } from "@angular/core";
@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(recipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        "https://ka-angular-default-rtdb.europe-west1.firebasedatabase.app/recipes.json"
      );
    }),
    map((recipes) => {
      console.log(recipes);
      return recipes["recipes"].map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map((recipes) => new recipeActions.SetRecipies(recipes))
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
