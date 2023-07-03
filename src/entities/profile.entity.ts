import { Entity, Column, PrimaryGeneratedColumn,OneToOne,JoinColumn } from 'typeorm';

@Entity({ name:"profile" })
export class Profile {
    @PrimaryGeneratedColumn({ type:"bigint" })
    id : number 

    @Column({ type:"text",nullable:true })
    bio : string

    @Column({ type:"varchar" , length:150,nullable:true })
    location : string 

    @Column({ type:"tinytext",nullable:true })
    avatar : string

    @Column({ type:"tinytext", nullable:true })
    profession : string 

    @Column({ type:"tinytext", nullable:true })
    phone : string 

    @Column({ type:"varchar" , length:120,nullable:true })
    birthday : string

    @Column({ type:"tinytext",nullable:true })
    website : string

    @Column({ default:new Date().toUTCString() })
    createdAt : string
}