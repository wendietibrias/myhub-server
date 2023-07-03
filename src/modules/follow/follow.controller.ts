import { Controller,HttpCode,Patch,Get,Param,Req, Delete,Query } from "@nestjs/common";
import { IRequest } from "src/interfaces/request.interface";
import { FollowService } from "./follow.service";
import { FollowDTO } from "./follow.dto";

@Controller("api")

export class FollowController {
  
    constructor(
        private followService : FollowService
    ){}

    @HttpCode(200)
    @Get("get/follow")
    async getFollowData(
        @Req() req : IRequest,
        @Query('filterType') filterType : string
    ){
       const { id:userId } = req.user;
       return await this.followService.getFollowData(filterType, Number(userId));
    }

    @HttpCode(200)
    @Patch("follow/:id")
    async follow(
        @Param('id') followingId : string,
        @Req() req : IRequest,
    ) {
        const { id:userId } = req.user;
        return await this.followService.follow(userId,Number(followingId));
        
    }

    @HttpCode(200)
    @Delete("unfollow/:id")
    async unfollow(
        @Param('id') followingId : string 
    ) {
       return await this.followService.unfollow(Number(followingId));
    }
}