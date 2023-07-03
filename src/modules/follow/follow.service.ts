import { Injectable,InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Following, User } from "src/entities";
import { Follower } from "src/entities/follower.entity";
import { Repository } from "typeorm";
import { FollowDTO } from "./follow.dto";

@Injectable()

export class FollowService {
   constructor(
     @InjectRepository(User) private user : Repository<User>,
     @InjectRepository(Follower) private follower : Repository<Follower>,
     @InjectRepository(Following) private following : Repository<Following>
   ){}

   async getFollowData(filterType : string , userId : number) {
       try {
          let followData;

          if(filterType === 'follower') {
               followData = await this.follower.find({
                  where: {
                     user: {
                        id:userId
                     }
                  },
               })
          }

          if(filterType === 'following') {
              followData = await this.following.find({
                  where: {
                     user: {
                         id:userId
                     }
                  }
              })
          }

          return {
             message:'data found',
             data:followData,
             statusCode:200
          }

       } catch(err) {
           throw new InternalServerErrorException(err.message);
       }
   }

    async follow(userId : number , followingId : number) {
        try {           
           const findUser = await this.user.findOne({
               where: {
                  id:userId 
               },
               relations: {
                  profile:true
               }
           });
           const findFollowingUser = await this.user.findOne({ 
                where: {
                    id:followingId 
                },
                relations: {
                     profile:true
                }
            });
           
           const follower = new Follower();
           const following = new Following();

           following.avatar = findFollowingUser.profile.avatar;
           following.name = findFollowingUser.name;
           following.bio = findFollowingUser.profile.bio;
           following.user = findUser;
           following.followingId = findFollowingUser.id;

           follower.name = findUser.name;
           follower.avatar = findUser.profile.avatar;
           follower.bio = findUser.profile.bio;
           follower.user = findFollowingUser;
           follower.followerId = findUser.id;

           const saveFollower = await this.follower.save(follower);
           const saveFollowing = await this.following.save(following);

           if(saveFollower && saveFollowing) {
               return {
                  message:"follow ok",
                  statusCode:200
               }
           }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async unfollow(followingId : number) {
       try {
          const deleteFollowing = await this.following.delete({ id:followingId });
          const deleteFollower = await this.follower.delete({ id:followingId });

          if(deleteFollowing && deleteFollower) {
              return {
                message:"unfollow",
                statusCode:200
              }
          }

       } catch(err) {
           throw new InternalServerErrorException(err.message);
       }
    }
}