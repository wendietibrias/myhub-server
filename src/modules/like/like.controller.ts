import { Controller,Post,HttpCode,Req,Param } from "@nestjs/common";
import { LikeService } from "./like.service";
import { IRequest } from "src/interfaces/request.interface";

@Controller("api/like")

export class LikeController {
     constructor(
        private likeService : LikeService
     ){}

     @HttpCode(200)
     @Post("/:id")
     async like(
        @Req() req : IRequest,
        @Param('id') postId : string
     ) {
         const { id:userId } = req.user;
         return await this.likeService.like(Number(postId) , Number(userId));
     }
}