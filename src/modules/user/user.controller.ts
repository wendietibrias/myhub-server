import { Controller,Get,Query,HttpCode, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { IRequest } from "src/interfaces/request.interface";

@Controller("api/user")

export class UserController {
     constructor(
          private userService : UserService
     ){}

     @HttpCode(200)
     @Get("/all")
     async getAllUser(
          @Req() req : IRequest
     ) {
         const { id:userId } = req.user;
         return await this.userService.getAllUser(Number(userId));
     }

     @HttpCode(200)
     @Get("/search")
     async searchUser(
          @Query('search') query : string
     ) {
        return await this.userService.searchUser(query);
     }
}