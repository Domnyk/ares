import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, switchMap, takeUntil} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {DictionaryService} from '../../service/dictionary.service';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {ElementType} from '../../model/element-type.enum';
import {SearchService} from '../../service/search.service';
import {Recipe} from '../../model/recipe';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {

  private ingredientsForm: FormControl = new FormControl(null);
  private categoriesForm: FormControl = new FormControl(null);
  private nameForm: FormControl = new FormControl(null);
  private preparationTimeForm: FormControl = new FormControl(null);
  private difficultyForm: FormControl = new FormControl(null);
  private shouldIncludeReplacements: boolean = false;
  private unsubscribe = new Subject<void>();

  public selectedIngredients: string[] = [];
  public selectedCategories: string[] = [];
  public searchForm!: FormGroup;
  public elementType = ElementType;
  public shouldShowWarningMsg: boolean = false;
  public searchIngredients!: (text: Observable<string>) => Observable<string[]>;
  public searchCategories!: (text: Observable<string>) => Observable<string[]>;
  public suggestsTitles!: (text: Observable<string>) => Observable<string[]>;

  @Input() initialTitleSearch: string | null = null;
  @Output() foundRecipes: EventEmitter<Recipe[]> = new EventEmitter<Recipe[]>();

  constructor(private formBuilder: FormBuilder, private dictionaryService: DictionaryService, private searchService: SearchService) {
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

    this.searchIngredients = this.dictionaryService.searchIngredientsNames(this.selectedIngredients);
    this.searchCategories = this.dictionaryService.searchCategoriesNames(this.selectedCategories);
    this.suggestsTitles = this.getTitlesSuggestions();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
    const requestParams: { [header: string]: string | string[] } = this.createRequestParams();

    if (Object.keys(requestParams).length === 0) {
      this.shouldShowWarningMsg = true;
      return;
    }

    this.shouldShowWarningMsg = false; // hide any previous warning msg
    this.searchService.findRecipes(requestParams).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((recipes: Recipe[]) =>
      this.foundRecipes.emit(recipes)
    );
  }

  public toggleReplacements(): void {
    this.shouldIncludeReplacements = !this.shouldIncludeReplacements;
  }

  private createRequestParams(): { [header: string]: string | string[] } {
    const requestParams: { [header: string]: string | string[] } = {};
    if (!!this.nameForm.value) {
      requestParams.title = this.nameForm.value;
    }

    if (!!this.preparationTimeForm.value) {
      requestParams.time = this.preparationTimeForm.value;
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

    if (this.shouldIncludeReplacements) {
      requestParams.replacements = 'true';
    }

    return requestParams;
  }

  getTitlesSuggestions(): (text: Observable<string>) => Observable<string[]> {
    return (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length > 2 ? this.getTitlesNames(term) : of([])
        ));
  }

  private getTitlesNames(term: string): Observable<string[]> {
    const requestParams: { [header: string]: string | string[] } = this.createRequestParams();
    requestParams.title = term;
    requestParams.fields = 'title';

    return this.searchService.findRecipes(requestParams).pipe(
      map((recipes: Recipe[]) => recipes.map(recipe => recipe.title) )
    );
  }
}
