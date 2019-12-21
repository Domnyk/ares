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
    this.rating = (this.initialRating === null ? 0 : this.initialRating);
  }

  updateRating(newRating: number): void {
    this.rating = newRating;
    this.ratingClick.emit(this.rating);
  }
}
