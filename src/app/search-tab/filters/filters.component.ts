import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DictionaryService} from '../../service/dictionary.service';
import {Ingredient} from '../../model/ingredient';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {Category} from '../../model/category';
import {ElementType} from '../../model/element-type.enum';
import {RecipeSearchDto} from '../../model/recipe-search-dto';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  private ingredientsForm: FormControl = new FormControl(null);
  private categoriesForm: FormControl = new FormControl(null);
  private nameForm: FormControl = new FormControl(null);
  private preparationTimeForm: FormControl = new FormControl(null);
  private difficultyForm: FormControl = new FormControl(null);

  public searchIngredients!: (text: Observable<string>) => Observable<string[]>;
  public searchCategories!: (text: Observable<string>) => Observable<string[]>;

  private selectedIngredients: string[] = [];
  private selectedCategories: string[] = [];

  public searchForm!: FormGroup;
  public elementType = ElementType;
  public shouldShowWarningMsg: boolean = false;

  @Input() initialTitleSearch: string | null = null;

  constructor(private formBuilder: FormBuilder, private dictionaryService: DictionaryService) {
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      name: this.nameForm,
      categories: this.categoriesForm,
      ingredients: this.ingredientsForm,
      difficulty: this.difficultyForm,
      preparationTime: this.preparationTimeForm
    });

    this.nameForm.setValue(this.initialTitleSearch);

    this.searchIngredients = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.getIngredients(term)
        ));

    this.searchCategories = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.getCategories(term)
        ));
  }

  getIngredients(term: string): Observable<string[]> | [] {
    return term.length < 2 ? []
      : this.dictionaryService.getIngredients(term).pipe(
        map((ingredients: Ingredient[]) =>
          ingredients.map((ingredient: Ingredient) => ingredient.name)
            .filter((ingredient: string) => !this.selectedIngredients.includes(ingredient))));
  }

  getCategories(term: string): Observable<string[]> | [] {
    return term.length < 2 ? []
      : this.dictionaryService.getCategories(term).pipe(
        map((categories: Category[]) =>
          categories.map((category: Category) => category.name)
            .filter((category: string) => !this.selectedCategories.includes(category))));
  }

  selectIngredient(event: NgbTypeaheadSelectItemEvent) {
    event.preventDefault();
    this.selectedIngredients.push(event.item);
    this.ingredientsForm.reset();
  }

  selectCategory(event: NgbTypeaheadSelectItemEvent) {
    event.preventDefault();
    this.selectedCategories.push(event.item);
    this.categoriesForm.reset();
  }

  removeSelectedIngredient(removedIngredient: string): void {
    this.selectedIngredients.splice(this.selectedIngredients.indexOf(removedIngredient), 1);
  }

  removeSelectedCategory(removedCategory: string) {
    this.selectedCategories.splice(this.selectedCategories.indexOf(removedCategory), 1);
  }

  search(): void {
    const requestParams: RecipeSearchDto = {};

    if (!!this.nameForm.value) {
      requestParams.name = this.nameForm.value;
    }

    if (!!this.preparationTimeForm.value) {
      requestParams.preparationTime = this.preparationTimeForm.value;
    }

    if (!!this.difficultyForm.value) {
      requestParams.difficulty = this.difficultyForm.value;
    }

    if (this.selectedIngredients.length !== 0) {
      requestParams.ingredients = this.selectedIngredients;
    }

    if (this.selectedCategories.length !== 0) {
      requestParams.categories = this.selectedCategories;
    }
    if (Object.keys(requestParams).length === 0) {
      this.shouldShowWarningMsg = true;
      return;
    }

    this.shouldShowWarningMsg = false; // hide any previous warning msg

    // TODO add RecipeService call to find recipes
  }
}
