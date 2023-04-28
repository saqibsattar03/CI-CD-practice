import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("coffees")
export class AppController {
  constructor(private readonly appService: AppService) {}

  

}
