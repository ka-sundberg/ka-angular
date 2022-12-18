import { Recipe } from "../recipe.model";
import * as recipeActions from "./recipe.actions";
export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};
export function recipeReducer(
  state = initialState,
  action: recipeActions.RecipeActions
) {
  switch (action.type) {
    case recipeActions.SET_RECIPES:
      return { ...state, recipes: [...action.payload] };
    default:
      return state;
  }
}
