import { Module,NestModule,MiddlewareConsumer } from "@nestjs/common"
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment, Like, Post, User } from "src/entities";
import { AuthorizeMiddleware } from "src/middleware/authorize.middleware";

@Module({
    imports:[
        TypeOrmModule.forFeature([User,Post,Like,Comment])
    ],
    controllers:[CommentController],
    providers:[CommentService]
})

export class CommentModule implements NestModule {
   configure(consumer : MiddlewareConsumer) {
       consumer.apply(AuthorizeMiddleware).forRoutes(CommentController)
   }
}