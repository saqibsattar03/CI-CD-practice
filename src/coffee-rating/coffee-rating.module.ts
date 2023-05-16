import { Module } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  imports: [CoffeesService],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
