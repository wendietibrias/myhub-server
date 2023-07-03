import { Module,NestModule,MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Following, User } from "src/entities";
import { Follower } from "src/entities/follower.entity";
import { FollowService } from "./follow.service";
import { FollowController } from "./follow.controller";
import { AuthorizeMiddleware } from "src/middleware/authorize.middleware";

@Module({
    imports:[
        TypeOrmModule.forFeature([User,Follower,Following])
    ],
    controllers:[FollowController],
    providers:[FollowService]
})

export class FollowModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthorizeMiddleware).forRoutes(FollowController);
    }
}