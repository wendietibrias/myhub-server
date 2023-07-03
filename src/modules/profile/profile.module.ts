
import { Module,NestModule,MiddlewareConsumer } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post, Profile, User } from "src/entities";
import { AuthorizeMiddleware } from "src/middleware/authorize.middleware";

@Module({
    imports:[
        TypeOrmModule.forFeature([User,Post,Profile])
    ],
    controllers:[ProfileController],
    providers:[ProfileService]
})

export class ProfileModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthorizeMiddleware).forRoutes(ProfileController)
    }
}