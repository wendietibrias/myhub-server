import { Module,NestModule,MiddlewareConsumer } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile, User } from "src/entities";
import { AuthorizeMiddleware } from "src/middleware/authorize.middleware";

@Module({
    imports:[
        TypeOrmModule.forFeature([User,Profile])
    ],
    controllers:[UserController],
    providers:[UserService]
})

export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthorizeMiddleware).forRoutes(UserController);
    }
}