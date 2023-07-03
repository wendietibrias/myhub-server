import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, User } from "src/entities";
import { Like, Not, Repository } from "typeorm";

@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User) private user : Repository<User>,
        @InjectRepository(Profile) private profile : Repository<Profile>
    ){}

    async searchUser(query : string) {
        try {
          const findSearchUser = await this.user.find({
              where: {
                  name:Like(query)
              },
              relations: {
                 profile:true
              }
          });

          const findAllUser = await this.user.find({
              relations: {
                 profile:true
              }
          });

          if(findSearchUser.length === 0) {
             return {
                 data:findAllUser,
                 message:"not found",
                 statusCode:200
             }
          }

          return {
            data:findSearchUser,
            message:`${findSearchUser.length} accounts found`,
            statusCode:200
          }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async getAllUser(userId : number) {
        try {
            const findAllUser = await this.user.find({
                where:{
                    id : Not(userId)
                },
                 relations: {
                    profile:true
                 }
            });

            return {
                message:"all user",
                statusCode:200,
                data:findAllUser
            }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}