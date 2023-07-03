import { Entity, Column, PrimaryGeneratedColumn,ManyToOne,JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity({ name:"comments" })
export class Comment {
    @PrimaryGeneratedColumn({ type:"bigint" })
    id : number
    
    @Column({ type:"text",nullable:true })
    comment : string 

    @Column({ type:"tinytext",nullable:true })
    commentImage : string 

    @ManyToOne(()=>Post, post => post.comments , { onDelete:"CASCADE" })
    @JoinColumn()
    post : Post

    @ManyToOne(() => User, user => user.comments , { onDelete:"CASCADE" })
    @JoinColumn()
    user : User

    @Column({ default:new Date().toUTCString() })
    createdAt : string;
}