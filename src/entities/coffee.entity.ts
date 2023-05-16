import { Flavor } from 'src/coffees/entities/flavor.entity/flavor.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity() // it will generate the table with the name of the class if no name specified in entity ()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true,
  })
  // @ManyToMany(type=> Flavor,(flavor)=> flavor.coffees)
  flavors: Flavor[];
}
