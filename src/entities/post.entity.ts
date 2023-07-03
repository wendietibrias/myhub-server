import { Entity, Column, PrimaryGeneratedColumn,ManyToOne,OneToMany,JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Entity({ name:"posts" })
export class Post {
    @PrimaryGeneratedColumn({ type:"bigint" })
    id : number 

    @Column({ type:"tinytext",nullable:true })
    title : string

    @Column({ type:"tinytext" })
    postImage : string

    @ManyToOne(() => User , user => user.posts, { onDelete:"CASCADE" })
    @JoinColumn()
    user : User

    @OneToMany(()=>Like , like => like.post)
    @JoinColumn()
    likes : Like[]

    @OneToMany(() => Comment , comment => comment.post)
    @JoinColumn()
    comments : Comment[]


    @Column({ default:new Date().toUTCString() })
    createdAt : string 
}