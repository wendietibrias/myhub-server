import { Injectable,InternalServerErrorException,BadRequestException,UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { Repository } from "typeorm";
import { LoginDTO, RegisterDTO } from "./auth.dto";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()

export class AuthService {
    constructor(
        @InjectRepository(User) private user : Repository<User>,
        private jwt : JwtService
    ) {}

    async login(body : LoginDTO) {
        const { email,password } = body;

        try {
            //check if user exists
            const findUser = await this.user.findOne({
                 where: {
                     email:email 
                 },
                 relations: {
                     profile:true
                 }
            });

            if(!findUser) {
                throw new BadRequestException("Account is not exists");
            }

            //check if account already in use
            if(findUser.authenticationToken) {
                throw new BadRequestException("Account already in use");
            }

            //compare password
            const comparePassword = await bcrypt.compare(password, findUser.password);


            if(comparePassword) {
                const token = this.jwt.sign({ 
                    id:findUser.id, 
                    name:findUser.name,
                    avatar:findUser?.profile?.avatar ,
                    email:findUser.email
                })
                findUser.authenticationToken = token;

                await this.user.save(findUser);

                 return {
                    data: {
                        access_token:token,
                    },
                    statusCode:200,
                    message:"token generated"
                  }
            }

            throw new BadRequestException("authentication fail");
              
        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async register(body : RegisterDTO) {
        const { name,email,password,confirm } = body;

         try {
            //check if account not exists
            const findUser = await this.user.findOneBy({ email:email });
    
            if(findUser) {
                throw new BadRequestException("account is already exists");
            }

            //check password matching with confirm
            if(password !== confirm) {
                throw new BadRequestException("password is not match");
            }

            const userCreate = this.user.create({
                 name,
                 email,
            })

            const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
            const hash = await bcrypt.hash(password , salt);

            
            if(hash) {
                userCreate.password = hash;
                await this.user.save(userCreate);
 
                return {
                   message:"account created",
                   statusCode:200
               }
            }

         } catch(err) {
            throw new InternalServerErrorException(err.message);
         }
    }

    async logout(id : string) {
         try {
            const findUser = await this.user.findOneBy({ id:Number(id) });

            if(!findUser) {
                throw new UnauthorizedException("account is not exists")
            }

            if(findUser.authenticationToken) {
                findUser.authenticationToken = null;
                const saveUser = await this.user.save(findUser);

                if(saveUser) {
                    return {
                        message:"logout success",
                        statusCode:200
                    }
                }
            }

            throw new UnauthorizedException("account is not in use");

         } catch(err) {
            throw new InternalServerErrorException(err.message);
         }
    }
}