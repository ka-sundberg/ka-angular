import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES = "[RECIPIES] set recipies";
export const FETCH_RECIPES = "[RECIPIES] fetch recipies";

export class SetRecipies implements Action {
  readonly type = SET_RECIPES;
  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
  // constructor(public payload: Recipe[]) {}
}

export type RecipeActions = SetRecipies | FetchRecipes;
