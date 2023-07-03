import { Injectable,InternalServerErrorException,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post, User } from "src/entities";
import { Repository } from "typeorm";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { existsSync, unlinkSync } from "fs";

@Injectable()

export class PostService {
     constructor(
        @InjectRepository(Post) private post : Repository<Post>,
        @InjectRepository(User) private user : Repository<User>
     ){}

     async getAllPost() {
         try {
            const findAllPost = await this.post.find({
                relations: {
                     likes: {
                        user:true 
                     },
                     comments: {
                        user:true
                     },
                     user:{
                        profile:true
                     }
                 },
                 order: {
                    createdAt:"ASC"
                 }
            });

            return {
               data:findAllPost,
               statusCode:200,
               message:"ok"
            }

         } catch(err) {
             throw new InternalServerErrorException(err.message);
         }
     }

     async getPost(id : number) {
          try {
            const findPost = await this.post.findOne({
                where: {
                  id:id 
                },
                relations: {
                   user:{
                    profile:true
                   },
                   likes:{
                     user:true 
                   },
                   comments:{
                     user:{
                        profile:true
                     }
                   }
                }
            });

            if(!findPost) {
                throw new NotFoundException("post is not found")
            }

            return {
               data:findPost,
               statusCode:200,
               message:"detail is found"
            }
            
         } catch(err) {
             throw new InternalServerErrorException(err.message);
         }
     }

     async createPost(body : CreatePostDTO , userId : number) {
         const { title ,postImage } = body;

         try {
            const findUser = await this.user.findOne({
                where: { id:userId },
            })

            const postInit = new Post();

            postInit.title = title;
            postInit.postImage = postImage.filename;
            postInit.user = findUser;

            const savePost = await this.post.save(postInit);

            if(savePost) {
                return {
                    message:"post uploaded",
                    statusCode:200
                }
            }

         } catch(err) {
             throw new InternalServerErrorException(err.message);
         }
     }

     async deletePost(userId : number , postId : number) {
        try {
           const findPost = await this.post.findOneBy({ id:postId });
  
           if(!findPost) {
               throw new NotFoundException("post is not found");
           }

           const path = `upload/posts/${findPost.postImage}`;

           if(existsSync(path)) {
              unlinkSync(path);
           }

           const deletePost = await this.post.delete({ id:postId });

           if(deletePost) {
              return {
                message:"post is deleted",
                statusCode:200
              }
           }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
     }

     async getUpdatePostData(postId : number) {
         try {
            const findPost = await this.post.findOne({ where:{ id:postId } });
            return {
                data:findPost,
                message:"ok",
                statusCode:200
            }

         } catch(err) {
            throw new InternalServerErrorException(err.message);
         }
     }

     async updatePost(body : UpdatePostDTO, postId : number) {
         const { title ,postImage } = body;
         try {
            const findPost = await this.post.findOneBy({ id:postId });

            if(!findPost) {
                throw new NotFoundException("post is not found")
            }

            const path = `upload/posts/${findPost.postImage}`;

            if(postImage && existsSync(path)) {
                 unlinkSync(path);
                 findPost.postImage = postImage.filename;
            }

            findPost.title = title;

            const savePost = await this.post.save(findPost);

            if(savePost) {
                return {
                    message:"post is updated",
                    statusCode:200
                }
            }

         } catch(err) {
            throw new InternalServerErrorException(err.message);
         }
     }
}