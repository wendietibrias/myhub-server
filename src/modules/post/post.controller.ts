import {
     Controller,
     UseInterceptors,
     UploadedFile,
     Get,
     Post,
     Delete,
     Put ,
     HttpCode,
     Param,
     Body,
     Req
    } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "src/utils/multer.config";
import { PostService } from "./post.service";
import { File } from "buffer";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { IRequest } from "src/interfaces/request.interface";

@Controller("api/post")

export class PostController {
    constructor(
        private postService : PostService
    ){}

    @HttpCode(200)
    @Get("all")
    async getAllPost() {
        return await this.postService.getAllPost();
    }

    @HttpCode(200)
    @Get("/:id")
    async getPost(
        @Param('id') id : string
    ) {
        return await this.postService.getPost(Number(id))
    }

    @HttpCode(200)
    @Post("create")
    @UseInterceptors(FileInterceptor('postImage' , {
         storage:diskStorage({
             destination:"./upload/posts",
             filename:editFileName
         }),
         fileFilter:imageFileFilter
    }))
    async createPost(
        @UploadedFile() file : File,
        @Body() body : CreatePostDTO,
        @Req() req : IRequest
    ) {
        const { id } = req.user;
        return await this.postService.createPost({...body,postImage:file} , Number(id));
    }

    @HttpCode(200)
    @Delete("delete/:id")
    async deletePost(
        @Param('id') postId : string,
        @Req() req : IRequest
    ) {
        const { id:userId } = req.user;
        return await this.postService.deletePost(Number(userId),Number(postId));
    }

    @HttpCode(200)
    @Get("update/get-data/:id")
    async getUpdatePostData(
         @Param('id') postId : string
    ) {
        return await this.postService.getUpdatePostData(Number(postId));
    }

    @HttpCode(200)
    @Put("update/:id")
     @UseInterceptors(FileInterceptor('postImage' , {
         storage:diskStorage({
             destination:"./upload/posts",
             filename:editFileName
         }),
         fileFilter:imageFileFilter
    }))
    async updatePost(
        @UploadedFile() file : File,
        @Body() body : UpdatePostDTO,
        @Param('id') postId : string,
        @Req() req : IRequest
    ) {
         const { id:userId } = req.user;
         return await this.postService.updatePost({...body,postImage:file} , Number(postId));
    }
}