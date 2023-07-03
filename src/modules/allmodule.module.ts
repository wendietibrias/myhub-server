import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PostModule } from "./post/post.module";
import { LikeModule } from "./like/like.module";
import { CommentModule } from "./comment/comment.module";
import { ProfileModule } from "./profile/profile.module";
import { FollowModule } from "./follow/follow.module";
import { UserModule } from "./user/user.module";

@Module({
    imports:[
        AuthModule,
        PostModule,
        LikeModule,
        CommentModule,
        ProfileModule,
        FollowModule,
        UserModule
    ],
    controllers:[],
    providers:[]
})

export class AllModule {}