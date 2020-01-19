import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FieldValidationService} from '../service/field-validation.service';
import {Router} from '@angular/router';
import {Observable, Subject, throwError} from 'rxjs';
import {RecipeService} from '../service/recipe.service';
import {takeUntil} from 'rxjs/operators';
import {Recipe} from '../model/recipe';
import {AuthService} from '../service/auth.service';
import {CurrentUser} from '../model/current-user';
import {Ingredient} from '../model/ingredient';
import {DictionaryService} from '../service/dictionary.service';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {ElementType} from '../model/element-type.enum';


@Component({
  selector: 'app-recipe-editor',
  templateUrl: './recipe-editor.component.html',
  styleUrls: ['./recipe-editor.component.scss']
})
export class RecipeEditorComponent implements OnInit, OnDestroy {
  public recipe: Recipe | null = null;
  public editMode: boolean = false;

  lastAttemptFailed: boolean | null = null;
  lastRecipeId: number | null = null;
  lastRecipeName: string | null = null;

  deletedSuccessfully: boolean | null = null;

  public searchIngredients!: (text: Observable<string>) => Observable<string[]>;
  public searchCategories!: (text: Observable<string>) => Observable<string[]>;

  public selectedIngredientsNames: string[] = [];
  public selectedCategories: string[] = [];

  public elementType = ElementType;

  title: FormControl = new FormControl('', [Validators.required]);
  description: FormControl = new FormControl('', [Validators.required]);
  difficulty: FormControl = new FormControl('', [Validators.required]);
  categories: FormControl = new FormControl();
  ingredients: FormControl = new FormControl();

  requiredTime: FormControl = new FormControl('', [
    Validators.required,
    Validators.max(Number.MAX_SAFE_INTEGER)
  ]);
  recipeForm: FormGroup;

  currentUserId: number | null = null;


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
  }

  ngOnInit() {
    this.recipe = history.state;
    if (this.recipe !== null && this.recipe.title !== undefined) {
      this.editMode = true;
      this.title.patchValue(this.recipe.title);
      this.description.patchValue(this.recipe.description);
      this.selectedCategories = this.recipe.categories;
      this.selectedIngredientsNames = this.recipe.ingredients
        .map((ingredient: Ingredient) => {
          return ingredient.name;
        });
      this.difficulty.patchValue(this.recipe.difficulty);
      this.requiredTime.patchValue(this.recipe.time);
    }

    this.authService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user: CurrentUser | null) => {
          if (user != null && user.id != null) {
            this.currentUserId = user.id;
          } else {
            throwError('Can not fetch user id');
          }
        }
      );

    this.searchCategories = this.dictionaryService.searchCategoriesNames(this.selectedCategories);
    this.searchIngredients = this.dictionaryService.searchIngredientsNames(this.selectedIngredientsNames);
  }

  removeSelectedCategory(removedCategory: string): void {
    this.selectedCategories.splice(this.selectedCategories.indexOf(removedCategory), 1);
  }

  selectCategory(event: NgbTypeaheadSelectItemEvent): void {
    event.preventDefault();
    this.selectedCategories.push(event.item);
    this.categories.reset();
  }

  removeSelectedIngredient(removedIngredient: string): void {
    this.selectedIngredientsNames.splice(this.selectedIngredientsNames.indexOf(removedIngredient), 1);
  }

  selectIngredient(event: NgbTypeaheadSelectItemEvent): void {
    event.preventDefault();
    this.selectedIngredientsNames.push(event.item);
    this.ingredients.reset();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  sendRecipe(): void {
    const newRecipe = this.buildRecipe();
    if (newRecipe) {
      if (this.editMode && !!this.recipe && !!this.recipe.id) {
        this.recipeService.changeRecipe(this.recipe.id, newRecipe)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((recipe: Recipe) => {
            if (recipe) {
              console.log('Recipe was with id:' + recipe.id + ' was successfully changed into:');
              console.log(recipe);

              this.lastAttemptFailed = false;
              if (recipe.id !== undefined && recipe.title !== undefined) {
                this.lastRecipeId = recipe.id;
                this.lastRecipeName = recipe.title;
              }
            } else {
              this.lastAttemptFailed = true;
            }
          });
      } else {
        this.recipeService.addRecipe(newRecipe)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((recipe: Recipe) => {
            if (recipe) {
              console.log('Recipe was added successfully with id:' + recipe.id);
              console.log('Added recipe\n' + recipe);

              this.lastAttemptFailed = false;
              this.deletedSuccessfully = null;
              if (recipe.id !== undefined && recipe.title !== undefined) {
                this.lastRecipeId = recipe.id;
                this.lastRecipeName = recipe.title;
              }
            } else {
              this.lastAttemptFailed = true;
              this.deletedSuccessfully = null;

            }
          });
      }
    }

  }

  moveToCreatedRecipe(): void {
    this.router.navigate(['recipes/' + this.lastRecipeId]);
  }

  deleteRecipe() {
    if (this.editMode && this.recipe !== null && this.recipe.id !== undefined) {
      this.recipeService.deleteRecipe(this.recipe.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((isPassed: boolean) => {
            if (isPassed) {
              console.log('Recipe was successfully deleted.');
              this.deletedSuccessfully = true;
              this.lastAttemptFailed = null;
            } else {
              this.deletedSuccessfully = false;
              this.lastAttemptFailed = null;
            }
          }
        );
    }
  }

  moveToMainPage() {
    this.router.navigate(['']);
  }

  private buildRecipe(): Recipe | null {
    let selectedIngredients: Ingredient[] = [];

    this.dictionaryService.requestIngredients('')
      .subscribe(
        (ingredients: Ingredient[]) => {
          selectedIngredients = ingredients
            .filter(
              ingredient => {
                if (this.selectedIngredientsNames.includes(ingredient.name)) {
                  selectedIngredients.push(ingredient);
                }
              }
            );
        }
      );
    if (this.currentUserId) {
      return {
        title: this.title.value,
        description: this.description.value,
        categories: this.selectedCategories,
        ingredients: selectedIngredients,
        difficulty: this.difficulty.value,
        creationDate: new Date(),
        time: this.requiredTime.value,
        user: this.currentUserId
      };
    } else { return null; }
  }
}
