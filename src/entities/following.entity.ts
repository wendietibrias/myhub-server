import { Entity,Column,PrimaryGeneratedColumn,JoinColumn,ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity({ name:"following" })

export class Following {
     @PrimaryGeneratedColumn({ type:"bigint" })
     id : number

     @ManyToOne(() => User , user => user.following)
     @JoinColumn()
     user : User

     @Column({ type:"bigint" })
     followingId : number 

     @Column({ type:"varchar",length:120,nullable:true })
     name : string

     @Column({ type:"tinytext",nullable:true })
     avatar : string

     @Column({ type:"text",nullable:true })
     bio : string
}