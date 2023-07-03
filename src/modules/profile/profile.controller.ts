import { 
    Controller,
    HttpCode,
    Get,
    Put,
    Post,
    Req,
    Param,
    Body,
    UseInterceptors,
    UploadedFile
 } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { IRequest } from "src/interfaces/request.interface";
import { UpdateProfileDTO } from "./profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "src/utils/multer.config";
import { File } from "buffer";


@Controller("api/profile")

export class ProfileController {
    constructor(
        private profileService : ProfileService
    ){}

    @HttpCode(200)
    @Get("/:id")
    async getUserProfile(
        @Req() req : IRequest,
        @Param('id') userId : string
    ) {
        return await this.profileService.getUserProfile(Number(userId));
    }

    @HttpCode(200)
    @Get("/complete/:id")
    async getCompleteUserProfile(
        @Param('id') userId : string 
    ) {
        return await this.profileService.getCompleteUserProfile(Number(userId));
    }

    @HttpCode(200)
    @Put("update/:id")
    async updateProfile(
        @Param('id') postId : string,
        @Body() body : UpdateProfileDTO
    ) {
        return await this.profileService.updateProfile(body , Number(postId));
    }

    @HttpCode(200)
    @Post("update/avatar/:id")
    @UseInterceptors(FileInterceptor('avatarImage' , {
         storage:diskStorage({
            destination:"./upload/avatar",
            filename:editFileName
         }),
         fileFilter:imageFileFilter
    }))
    async updateAvatarProfile(
         @Param('id') userId : string,
         @UploadedFile() file : File
    ) {
       return await this.profileService.updateAvatarProfile(file , Number(userId));
    }
}