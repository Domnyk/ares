import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-rating',
  templateUrl: './recipe-rating.component.html',
  styleUrls: ['./recipe-rating.component.scss']
})
export class RecipeRatingComponent implements OnInit {
  @Input() initialRating!: number | null;

  @Output() ratingClick = new EventEmitter<number>();

  rating: number | null = null;

  readonly possibleRatings: number[] = [1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {
    if (this.isInitialRangeValid() === false) {
      this.initialRating = null;
    }

    this.rating = (this.initialRating === null ? 0 : this.initialRating);
  }

  updateRating(newRating: number): void {
    this.rating = newRating;
    this.ratingClick.emit(this.rating);
  }

  private isInitialRangeValid(): boolean {
    if (this.initialRating === null || this.initialRating > Math.max(...this.possibleRatings) ||
        this.initialRating < Math.min(...this.possibleRatings)) {
      console.warn(`${this.initialRating} is outside of valid range ${this.possibleRatings}.` +
                   'Setting initial rating to null');
      return false;
    } else if (this.initialRating === null) {
      return false;
    }

    return true;
  }
}
