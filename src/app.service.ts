import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(Number(process.env.SALT_ROUNDS));
    return 'Hello World!';
  }
}
