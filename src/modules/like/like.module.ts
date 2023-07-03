import { Module,NestModule,MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment, Post, User } from "src/entities";
import { Like } from "src/entities";
import { LikeController } from "./like.controller";
import { LikeService } from "./like.service";
import { AuthorizeMiddleware } from "src/middleware/authorize.middleware";

@Module({
    imports:[
        TypeOrmModule.forFeature([User,Post,Like,Comment])
    ],
    controllers:[LikeController],
    providers:[LikeService]
})

export class LikeModule implements NestModule {
    configure(consumer : MiddlewareConsumer) {
        consumer.apply(AuthorizeMiddleware).forRoutes(LikeController);
    }
}