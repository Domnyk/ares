import {Ingredient} from "./ingredient";

export interface RecipeToAdd {
  id?: number,
  title : string,
  description : string,
  categories: string[],
  ingredients: Ingredient[],
  difficulty: number,
  creationDate: Date,
  time: number,
  user: number
}
