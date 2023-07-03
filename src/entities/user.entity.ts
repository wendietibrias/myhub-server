import { Entity, Column, PrimaryGeneratedColumn,OneToOne,JoinColumn,OneToMany } from 'typeorm';
import { Profile } from './profile.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Follower } from './follower.entity';
import { Following } from './following.entity';

@Entity({ name:"users" })
export class User {
     @PrimaryGeneratedColumn({ type:"bigint" })
     id : number 

     @Column({ type:"varchar" , length:120 })
     name : string 

     @Column({ type:"varchar" , length:120, unique:true })
     email : string

     @Column({ type:"text",nullable:true })
     password : string

     @Column({ type:"text",nullable:true })
     authenticationToken : string

     @OneToMany(() => Post , post => post.user)
     @JoinColumn()
     posts : Post[]

     @OneToMany(()=>Like , like => like.user)
     @JoinColumn()
     likes : Like[]

     @OneToMany(() => Comment , comment => comment.user)
     @JoinColumn()
     comments : Comment[]

     @OneToMany(() => Follower, follower => follower.user)
     @JoinColumn()
     followers: Follower[]

     @OneToMany(() => Following , following => following.user)
     @JoinColumn()
     following: Following[]

     @OneToOne(() => Profile)
     @JoinColumn()
     profile : Profile
}