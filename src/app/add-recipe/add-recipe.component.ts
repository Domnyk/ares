import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FieldValidationService} from "../service/field-validation.service";
import {Router} from "@angular/router";
import {Observable, Subject, throwError} from "rxjs";
import {RecipeService} from "../service/recipe.service";
import {debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil} from "rxjs/operators";
import {RecipeToAdd} from "../model/recipe-to-add";
import {AuthService} from "../service/auth.service";
import {CurrentUser} from "../model/current-user";
import {Ingredient} from "../model/ingredient";
import {Category} from "../model/category";
import {DictionaryService} from "../service/dictionary.service";
import {NgbTypeaheadSelectItemEvent} from "@ng-bootstrap/ng-bootstrap";
import {ElementType} from "../model/element-type.enum";


@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit, OnDestroy {

  lastAttemptFailed : boolean | null = null;
  lastRecipeId: number | null = null;
  lastRecipeName: string | null = null;

  public searchIngredients!: (text: Observable<string>) => Observable<string[]>;
  public searchCategories!: (text: Observable<string>) => Observable<string[]>;

  public selectedIngredients: Ingredient[] = [];
  public selectedCategories: string[] = [];

  public elementType = ElementType;

  title: FormControl = new FormControl('', [Validators.required]);
  description: FormControl = new FormControl('', [Validators.required]);
  difficulty: FormControl = new FormControl('', [Validators.required]);
  categories: FormControl = new FormControl();
  ingredients: FormControl = new FormControl(  );

  requiredTime: FormControl = new FormControl('', [
    Validators.required,
    Validators.max(Number.MAX_SAFE_INTEGER)
  ]);
  recipeForm: FormGroup;

  currentUserId: number;


  private unsubscribe = new Subject<void>();

  constructor(public fieldValidationService: FieldValidationService, public recipeService: RecipeService,
              public authService: AuthService, public dictionaryService: DictionaryService,
              private formBuilder: FormBuilder, private router: Router) {
    this.recipeForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      difficulty: this.difficulty,
      requiredTime: this.requiredTime,
      categories: this.categories,
      ingredients: this.ingredients
    });
    this.currentUserId = 0;
  }

  ngOnInit() {
    console.info("created");
    this.authService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user: CurrentUser | null) => {
          if (user != null && user.id != null) {
              this.currentUserId = user.id
          }
          else throwError("Can not fetch user id")
        }
      );

    this.searchCategories = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.getCategories(term)
        ));

    this.searchIngredients = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.getIngredients(term)
        ));
  }

  getCategories(term: string): Observable<string[]> | [] {
    return this.dictionaryService.getCategories(term).pipe(
        map((categories: Category[]) =>
          categories.map((category: Category) => category.name)
            .filter((category: string) => !this.selectedCategories.includes(category))));
  }


  removeSelectedCategory(removedCategory: string) {
    this.selectedCategories.splice(this.selectedCategories.indexOf(removedCategory), 1);
  }

  selectCategory(event: NgbTypeaheadSelectItemEvent) {
    event.preventDefault();
    this.selectedCategories.push(event.item);
    this.categories.reset();
  }

  getIngredients(term: string): Observable<string[]> | [] {
    return this.dictionaryService.getIngredients(term).pipe(
      map((ingredients: Ingredient[]) =>
        ingredients.
            filter((ingredient: Ingredient) => !this.selectedIngredients.includes(ingredient))
        .map((ingredient:Ingredient) => JSON.stringify(ingredient))));
  }


  removeSelectedIngredient(removedCategory: string) {
    this.selectedCategories.splice(this.selectedCategories.indexOf(removedCategory), 1);
  }

  selectIngredient(event: NgbTypeaheadSelectItemEvent) {
    event.preventDefault();
    this.selectedIngredients.push(JSON.parse(event.item));
    this.ingredients.reset();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  sendRecipe() {
    let newRecipe = this.buildRecipe();
    this.recipeService.addRecipe(newRecipe)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((recipe:RecipeToAdd)=> {
        if (recipe) {
          console.log("success");
          this.lastAttemptFailed = false;
          if (recipe.id !== undefined && recipe.title !== undefined) {
            this.lastRecipeId = recipe.id;
            this.lastRecipeName = recipe.title;
          }
        } else {
          this.lastAttemptFailed = true;
        }
      });
  }

  moveToCreatedRecipe() {
    this.router.navigate(["recipes/"+this.lastRecipeId]);
  }

  private buildRecipe(): RecipeToAdd {
    let newRecipe: RecipeToAdd =
      {
        title: this.title.value,
        description: this.description.value,
        categories: this.selectedCategories,
        ingredients: this.selectedIngredients,
        difficulty: +this.difficulty.value,
        creationDate: new Date(),
        time: this.requiredTime.value,
        user: this.currentUserId
      };
    console.log("Recipe to add: ", newRecipe);

    return newRecipe;
  }
}
