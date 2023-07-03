import { Module,NestModule,MiddlewareConsumer,RequestMethod } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post, User,Like,Comment } from "src/entities";
import { AuthorizeMiddleware } from "src/middleware/authorize.middleware";

@Module({
    imports:[
        TypeOrmModule.forFeature([User,Post,Like,Comment])
    ],
    controllers:[PostController],
    providers:[PostService]
})

export class PostModule implements NestModule {
    configure(consumer : MiddlewareConsumer) {
        consumer.apply(AuthorizeMiddleware)
                .exclude(
                  {
                    path:"api/post/all",
                    method : RequestMethod.GET
                  },
                  {
                    path:"api/post/:id",
                    method: RequestMethod.GET
                  }
                )
                .forRoutes(PostController)
    }
}