import {
     Controller,
     Body,
     HttpCode,
     Post,
     Delete,
     Param,
     UploadedFile,
     UseInterceptors,
     Req ,
     Put
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDTO } from "./comment.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "src/utils/multer.config";
import { IRequest } from "src/interfaces/request.interface";
import { File } from "buffer";

@Controller("api/comment")

export class CommentController {
    constructor(
        private commentService : CommentService
    ){}
   
    @HttpCode(200)
    @Post("create/:id")
         @UseInterceptors(FileInterceptor('commentImage' , {
         storage:diskStorage({
             destination:"./upload/comments",
             filename:editFileName
         }),
         fileFilter:imageFileFilter
    }))
    async createComment(
        @Body() body : CreateCommentDTO,
        @Param('id') postId : string,
        @UploadedFile() file : File,
        @Req() req : IRequest
    ) {
        const { id:userId } = req.user;
        return await this.commentService.createComment({...body , commentImage:file} , Number(postId) , Number(userId));
    }

    @HttpCode(200)
    @Delete("delete/:id")
    async deleteComment(
        @Param('id') commentId : string
    ) {
        return await this.commentService.deleteComment(Number(commentId));
    }

    @HttpCode(200)
    @Put("update/:id")
     @UseInterceptors(FileInterceptor('commentImage' , {
         storage:diskStorage({
             destination:"./upload/comments",
             filename:editFileName
         }),
         fileFilter:imageFileFilter
    }))

    async updateComment(
        @Body() body : CreateCommentDTO,
        @Param('id') postId : string,
        @UploadedFile() file : File,
        @Req() req : IRequest
    ) {
        const { id:userId } = req.user;
        return await this.commentService.updateComment(Number(postId),{...body,commentImage:file});
    }
}