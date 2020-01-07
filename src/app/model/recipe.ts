import { Ingredient } from './ingredient';

export interface Recipe {
  id?: number;
  categories: string[];
  ingredients: Ingredient[];
  title: string;
  description: string;
  difficulty: number;
  creationDate: Date;
  time: number;
  user: number;
  image?: any; // TODO handle this later
}
