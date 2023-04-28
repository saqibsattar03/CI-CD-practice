import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PagonationQueryDto } from 'src/common/dto/pagonation-query.dto/pagonation-query.dto';
import { Coffee } from 'src/entities/coffee.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity/flavor.entity';

@Injectable()
export class CoffeesService {
    // private coffees: Coffee[] = [
    //     {
    //         id: 1,
    //         name: "buddy brew1",
    //         brand:"lol1",
    //         flavors:['choco1','vanilla1'],
    //     },
    //     {
    //         id: 2,
    //         name: "buddy brew2",
    //         brand:"lol2",
    //         flavors:['choco2','vanilla2'],
    //     },
    //     {
    //         id: 3,
    //         name: "buddy brew3",
    //         brand:"lol3",
    //         flavors:['choco3','vanilla3'],
    //     },
    //     {
    //         id: 4,
    //         name: "buddy brew4",
    //         brand:"lol4",
    //         flavors:['choco4','vanilla4'],
    //     }
    // ];

    constructor
    (
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[]
        
    ){
        console.log(coffeeBrands);
    }

    findAll(paginationQuery: PagonationQueryDto)
    {
        const {limit, offset} = paginationQuery;
        return this.coffeeRepository.find(
            {
                relations :['flavors'],
                skip : offset,
                take :limit,
            },
           
            );
    }

    async findOne(id: number)
    {
    console.log("hitted");
        const coffee = await this.coffeeRepository.findOne({where:{id},relations:["flavors"]});
        //const coffee = this.coffees.find(item=> item.id === +id);
        if(!coffee)
        {
            throw new HttpException(`Cofee #${id} not found`, HttpStatus.NOT_FOUND);
        }
        return coffee;
    }
   async create(createCoffeeDto : CreateCoffeeDto)
    {
        const  flavors = await Promise.all
        (
            createCoffeeDto.flavors.map
            (
                name=>this.preloadFlavorByName(name)
            ),
           
        );
        console.log("name of flavors = "+ flavors);
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
       
        if(!coffee)
        {
            return "no data created";
        }
        return this.coffeeRepository.save(coffee);
       // this.coffees.push(createCoffeeDto);
    }
    async update(id: string, updateCoffeeDto: UpdateCoffeeDto)
    {
        const flavors =
        updateCoffeeDto.flavors && await Promise.all(
            updateCoffeeDto.flavors.map(name=>this.preloadFlavorByName(name)),
        )
        const coffee =await this.coffeeRepository.preload({
            id: +id,
            ...UpdateCoffeeDto,
            flavors,
        })

        if(!coffee)
        {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
       // return this.coffeeRepository.save(UpdateCoffeeDto);
    }

   async remove(id: number)
    {
       const coffee = await this.coffeeRepository.findOne({where:{id}});
       return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name : string) : Promise<Flavor>
    {
        const existingFlavor = await this.flavorRepository.findOne({where:{name}});
        if(existingFlavor)
        {
            return existingFlavor;
        }

        return this.flavorRepository.create({name});
    }

    async recommendCoffee(coffee:Coffee)
    {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try
        {
            coffee.recommendations++;
            const recommendEvent =new Event();
            recommendEvent.name = "recommend_coffee";
            recommendEvent.type = "coffee";
            recommendEvent.paylaod = {coffeeId: coffee.id};

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();

        }
        catch(err)
        {
            await queryRunner.rollbackTransaction();
        }
        finally
        {
            await queryRunner.release();
        }

    }
}
