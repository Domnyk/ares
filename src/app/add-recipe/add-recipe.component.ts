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
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit, OnDestroy {

  lastAttemptFailed: boolean | null = null;
  lastRecipeId: number | null = null;
  lastRecipeName: string | null = null;

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

  removeSelectedIngredient(removedCategory: string): void {
    this.selectedIngredientsNames.splice(this.selectedCategories.indexOf(removedCategory), 1);
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
    this.recipeService.addRecipe(newRecipe)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((recipe: Recipe) => {
        if (recipe) {
          console.log('Recipe was added successfully with id:' + recipe.id);
          console.log('Added recipe\n' + recipe);

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

  moveToCreatedRecipe(): void {
    this.router.navigate(['recipes/' + this.lastRecipeId]);
  }

  private buildRecipe(): Recipe {
    let selectedIngredients: Ingredient[] = [];

    this.dictionaryService.requestIngredients('')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((ingredients: Ingredient[]) => {
          selectedIngredients = ingredients
            .filter((ingredient: Ingredient) => {
                if (this.selectedIngredientsNames.includes(ingredient.name)) {
                  selectedIngredients.push(ingredient);
                }
              }
            );
        }
      );

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
  }
}
