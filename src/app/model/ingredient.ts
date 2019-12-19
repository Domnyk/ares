export interface Ingredient {
  'id': number;
  'replacements': string[]; // TODO: replacemetns could be modeled as Ingridient[] but I don't know if this would help in anything
  'name': string;
}
