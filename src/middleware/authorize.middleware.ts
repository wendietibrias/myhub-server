import { NestMiddleware,UnauthorizedException,InternalServerErrorException } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { IRequest } from "src/interfaces/request.interface";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { Repository } from "typeorm";

export class AuthorizeMiddleware implements NestMiddleware {
    constructor(
        private jwt : JwtService,
        @InjectRepository(User) private user : Repository<User>
    ){}

    async use(req: IRequest, res: Response, next: NextFunction) {
         try {
           const headerToken = req.headers.authorization;

            if(!headerToken) {
                throw new UnauthorizedException("unauthorized");
            }

            const token = headerToken.split(" ")[1];

            const verifyToken = await this.jwt.verify(token, { secret:process.env.JWT_SECRET,algorithms:["HS384"] });

            const findUser = await this.user.findOneBy({ id:verifyToken.id });

            if(findUser.id != Number(verifyToken.id)) {
                throw new UnauthorizedException("Unauthorized");
            }

            if(!findUser.authenticationToken) {
                throw new UnauthorizedException("Unauthorized");
            }

            req.user = verifyToken;
            next();
         } catch(err) {
             throw new InternalServerErrorException(err.message);
         }
     }
}