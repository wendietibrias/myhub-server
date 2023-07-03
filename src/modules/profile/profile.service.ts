import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post, Profile, User } from "src/entities";
import { Repository } from "typeorm";
import { UpdateProfileDTO } from "./profile.dto";
import { JwtService } from "@nestjs/jwt";
import { File } from "buffer";
import { existsSync, unlinkSync } from "fs";

@Injectable()

export class ProfileService {
    constructor(
        @InjectRepository(User) private user : Repository<User>,
        @InjectRepository(Profile) private profile : Repository<Profile>,
        @InjectRepository(Post) private post : Repository<Post>,
        private jwtService : JwtService
    ){}

    //profile without posts
    async getUserProfile(userId : number) {
        try {
           const findUserProfile = await this.user.findOne({
               where: {
                id:userId 
               },
               relations: {
                   profile:true,
                   followers: {
                     user:true 
                   },
                   following: {
                      user:true
                   }
               }
           });

           return {
             data:findUserProfile,
             message:"profile get",
             statusCode:200
           }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    //profile with the posts
    async getCompleteUserProfile(userId : number) {
         try {
            const findUser = await this.user.findOne({
                  where: { id:userId },
                  relations: {
                    profile:true,
                     posts: {
                        user:{
                            profile:true
                        },
                        comments:{
                             user:true 
                        },
                        likes: {
                            user:true
                        }
                     },
                     following:true,
                     followers:true
                  }
            });

            return {
                data:findUser,
                statusCode:200,
                message:"1 result"
            }

         } catch(err) {
            throw new InternalServerErrorException(err.message);
         }
    }

    async updateProfile(body : UpdateProfileDTO ,postId : number) {
        const { name,email,bio,location,birthday,profession,website,address } = body;
  
         try {
            const findUser = await this.user.findOne({
                 where: {
                    id:postId
                 },
                 relations: {
                    profile:true
                 }
            });


             findUser.name = name;
             findUser.email = email;  
             
             if(!findUser?.profile) {
                 const profile = new Profile();
                 profile.website = website;
                 profile.location = address;
                 profile.birthday = birthday;
                 profile.profession = profession;
                 profile.bio = bio;

                 const saveProfile = await this.profile.save(profile);

                 findUser.profile = saveProfile;
             } else {
                 const findProfile = await this.profile.findOneBy({ id:findUser?.profile?.id });
                 findProfile.location = address;
                 findProfile.birthday = birthday;
                 findProfile.profession = profession;
                 findProfile.bio = bio;

                 const saveProfile = await this.profile.save(findProfile);

                 findUser.profile = saveProfile;
             }

             const saveUser = await this.user.save(findUser);
             const generateToken = this.jwtService.sign({ id:findUser?.id, name:findUser?.name,avatar:findUser?.profile?.avatar });

              if(saveUser) {
                return {
                    message:"profile is updated",
                    data:{
                        access_token:generateToken
                    },
                    statusCode:200
                }
              }

         } catch(err) {
            throw new InternalServerErrorException(err.message);
         }
    }

    async updateAvatarProfile(file : any , userId : number) {
        try {
            const findUser = await this.user.findOne({ 
                where: {
                    id:userId 
                },
                relations: {
                    profile:true
                }
             });

            const path = `upload/avatar/${findUser?.profile?.avatar}`;

            if(file && existsSync(path)) {
                unlinkSync(path);
            }

            if(!findUser.profile) {
                const profile = new Profile();
                profile.avatar = file.filename;
                const saveProfile = await this.profile.save(profile);

                findUser.profile = saveProfile;
            } else {
               const findProfile = await this.profile.findOne({ where:{ id:findUser?.profile?.id } });
               findProfile.avatar = file.filename;
               const saveProfile = await this.profile.save(findProfile);

               findUser.profile = saveProfile;
            }

            const saveUser = await this.user.save(findUser);

            const generateToken = this.jwtService.sign({
                 name:findUser?.name,
                 avatar:findUser?.profile?.avatar,
                 id:findUser?.id
            });

            if(saveUser) {
                return {
                    message:"avatar updated",
                    statusCode:200,
                    data: {
                        access_token:generateToken
                    }
                }
            }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}