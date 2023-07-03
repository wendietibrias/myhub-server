import { Entity, Column, PrimaryGeneratedColumn,ManyToOne,JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity({ name:"like" })
export class Like {
    @PrimaryGeneratedColumn({ type:"bigint" })
    id : number
    
    @ManyToOne(()=>User , user=>user.likes , { onDelete:"CASCADE" })
    @JoinColumn()
    user : User

    @ManyToOne(()=> Post , post => post.likes,{ onDelete:"CASCADE" })
    @JoinColumn()
    post : Post
}