export interface Recipe {
  id: string;
  categories: string[];
  ingredients: string[];
  title: string;
  description: string;
  difficulty: number;
  creationDate: Date;
  time: number;
  user: number;
  image?: any; // TODO handle this later
}
