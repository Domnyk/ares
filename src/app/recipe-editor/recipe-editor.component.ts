import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FieldValidationService} from '../service/field-validation.service';
import {Router} from '@angular/router';
import {Observable, Subject, throwError} from 'rxjs';
import {RecipeService} from '../service/recipe.service';
import {map, takeUntil} from 'rxjs/operators';
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
  difficulty: FormControl = new FormControl(1, [Validators.required]);
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
    if (this.recipe !== null && this.recipe.id !== undefined) {
      if (this.recipe.user === undefined) {
        this.recipeService.findRecipeById(this.recipe.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((fullRecipe: Recipe) => {
              this.fillFormControls(fullRecipe);
            }
          );
      } else {
        this.fillFormControls(this.recipe);
      }
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
    this.buildRecipe()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((newRecipe: Recipe | null) => {
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
                  console.log(recipe);

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
      });
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

  buildRecipe(): Observable<Recipe | null> {
    const _buildRecipe = (ingredients: Ingredient[], currentUserId: number | null) => {
      if (currentUserId === null) {
        return null;
      } else {
        return {
          title: this.title.value,
          description: this.description.value,
          categories: this.selectedCategories,
          ingredients,
          difficulty: this.difficulty.value,
          creationDate: new Date(),
          time: this.requiredTime.value,
          user: currentUserId
        };
      }
    };
    const keepMatching = (i: Ingredient) => this.selectedIngredientsNames.includes(i.name);
    const makeRecipe = (i: Ingredient[], currentUserId: number | null) => _buildRecipe(i, currentUserId);

    return this.dictionaryService.requestIngredients('').pipe(
      map((_ingredients: Ingredient[]) => _ingredients.filter(keepMatching)),
      map((ingredients) => makeRecipe(ingredients, this.currentUserId))
    );
  }

  private fillFormControls(recipe: Recipe) {
      this.editMode = true;
      this.title.patchValue(recipe.title);
      this.description.patchValue(recipe.description);
      this.selectedCategories = recipe.categories;
      this.selectedIngredientsNames = recipe.ingredients
        .map((ingredient: Ingredient) => {
          return ingredient.name;
        });
      this.difficulty.patchValue(recipe.difficulty);
      this.requiredTime.patchValue(recipe.time);
  }

}
