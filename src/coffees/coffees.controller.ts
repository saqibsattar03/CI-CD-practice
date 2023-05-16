import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  Query,
} from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import { PagonationQueryDto } from 'src/common/dto/pagonation-query.dto/pagonation-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeeService.findOne(id);
    //return `this action return #${id} coffee`;
  }

  @Get()
  findAllQ(@Query() paginationQuery: PagonationQueryDto) {
    return this.coffeeService.findAll(paginationQuery);
    // const{limit, offset } = paginationQuery;
    //return `this actions returns all the coffees #${limit} and #${offset} `
  }
  @Get()
  findAll(@Res() response) {
    response.HttpStatus(200).send('this actions returns all the coffees');

    //`this actions returns all the coffees`;
  }

  @Post()
  //@HttpCode(HttpStatus.GONE)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeeService.create(createCoffeeDto);
    //return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updteCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, updteCoffeeDto);
    //return `this action updates #${id} coffee`;
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeeService.remove(id);
    // return `this action deletes #${id}`;
  }
}
