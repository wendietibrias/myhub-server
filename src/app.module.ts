import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Profile,
  Post,
  Like,
  Comment ,
  Follower,
  Following
} from "./entities";
import { JwtModule } from '@nestjs/jwt';
import { AllModule } from './modules/allmodule.module';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
       type:"mysql",
       database: process.env.DB_NAME,
       username:process.env.DB_USERNAME,
       password:process.env.DB_PASSWORD,
       host:process.env.DB_HOST,
       port:Number(process.env.DB_PORT),
       entities:[Comment,User,Profile,Post,Like,Follower,Following],
       synchronize:false,
       autoLoadEntities:true,
    }),
    JwtModule.register({
        global:true,
        secret:process.env.JWT_SECRET,
        signOptions:{ algorithm:"HS384", expiresIn:"3d" }
    }),
    AllModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
