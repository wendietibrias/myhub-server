import { Injectable,InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Post, User } from "src/entities";
import { Repository } from "typeorm";

@Injectable()

export class LikeService {
    constructor(
        @InjectRepository(User) private user : Repository<User>,
        @InjectRepository(Like) private likes : Repository<Like>,
        @InjectRepository(Post) private post : Repository<Post>
    ){}

    async like(postId : number,userId : number) {
        try {
            //check if like not exists
            const findLike = await this.likes.findOne({
                where: {
                    post:{
                        id:postId
                    },
                    user: {
                        id:userId
                    }
                }
            });

            const findPost = await this.post.findOne({ where:{ id:postId } })
            const findUser = await this.user.findOne({ where:{ id:userId } });

            if(!findLike) {
                const initLike = new Like();

                initLike.post = findPost;
                initLike.user = findUser;
                
                const saveLikes = await this.likes.save(initLike);

                if(saveLikes) return { message:"liked",statusCode:200 }
            }

            const deleteLike = await this.likes.delete({ 
                  user:{
                     id:userId 
                  },
                  post: {
                    id:postId
                  }
             });

             if(deleteLike) return { message:"unlike",statusCode:200 }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}