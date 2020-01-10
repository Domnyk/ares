import { Recipe } from './recipe';
import { Rating } from './rating';

export interface RecipeWithRating {
  recipe: Recipe;
  rating: Rating;
}
