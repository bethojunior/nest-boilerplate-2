import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-ayth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      return await this.authService.login({ loginAuthDto });
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  async register(@Body() props: CreateAuthDto) {
    try {
      return await this.authService.register(props);
    } catch (error) {
      throw error;
    }
  }
}
