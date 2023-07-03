import { Injectable,InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment, Post,User } from "src/entities";
import { Repository } from "typeorm";
import { CreateCommentDTO, UpdateCommentDTO } from "./comment.dto";
import { existsSync, unlinkSync } from "fs";

@Injectable()

export class CommentService {
    constructor(
        @InjectRepository(Comment) private comment : Repository<Comment>,
        @InjectRepository(User) private user : Repository<User>,
        @InjectRepository(Post) private post : Repository<Post>
    ){}

    async getAllComment(postId : number , userId : number) {
        try {
            const findAllComment = await this.comment.find({
                 where: {
                     post: {
                        id:postId
                     }
                 },
                 relations: {
                     user:true
                 }
            });

            return {
                data:findAllComment,
                statusCode:200,
                message:"all comment"
            }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async createComment(body : CreateCommentDTO , postId : number,userId : number){
        const { comment,commentImage } = body;

         try {
            const findPost = await this.post.findOneBy({ id:postId });
            const findUser = await this.user.findOneBy({ id:userId });

            const createComment = new Comment();
            createComment.comment = comment;
            createComment.commentImage = commentImage ? commentImage.filename : null;
            createComment.user = findUser;
            createComment.post = findPost;

            const saveComment = await this.comment.save(createComment);

            if(saveComment) return { message:"comment posted",statusCode:200 }

         } catch(err) {
            throw new InternalServerErrorException(err.message);
         }
    }

    async deleteComment(commentId : number) {
        try {
            const findComment = await this.comment.findOneBy({ id:commentId });
            const deleteComment = await this.comment.delete({ id:commentId });

            const path = `upload/comments/${findComment.commentImage}`;

            if(existsSync(path)) {
                unlinkSync(path);
            }

            if(deleteComment) return { message:"comment destroy",statusCode:200 }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateComment(commentId : number , body : UpdateCommentDTO) {
         const { comment,commentImage } = body;

         try {
            const findComment = await this.comment.findOne({ where:{ id:commentId } });

            if(!findComment) return { message:"comment is not found",statusCode:200 }
  
            const path = `upload/comments/${findComment.commentImage}`;

            if(commentImage && existsSync(path)) {
                unlinkSync(path);
            }

            findComment.comment = comment;
            findComment.commentImage = commentImage ? commentImage.filename : findComment.commentImage;

            const saveComment = await this.comment.save(findComment);

            if(saveComment) return { message:"comment updated",statusCode:200 }
    
         } catch(err) {
            throw new InternalServerErrorException(err.message);
         }
    }
}