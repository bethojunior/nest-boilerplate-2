import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginPayload } from 'src/@types/utils/login-payload';
import { LoginAuthDto } from './dto/login-ayth.dto';
import { UserEntity } from 'src/@shared/entities/user.entity';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { BusinessException } from 'src/@shared/exceptions/business.exception';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}
  async login({
    loginAuthDto
  }: {
    loginAuthDto: LoginAuthDto;
  }): Promise<{ accessToken: string; user: UserEntity }> {
    
    const user = await this.findOneByEmail(loginAuthDto.email);

    if (!user) {
      throw new BusinessException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: LoginPayload = {
      sub: user.id,
      email: user.email,
    };
    
    const accessToken = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword
      },
      accessToken,
    };
  }

  async register(props: CreateAuthDto) : Promise<{ accessToken: string; user: UserEntity }>
  {
    try {
      const existingUser = await this.findOneByEmail(props.email);
      const hashedPassword = await bcrypt.hash(props.password, 10);
      if (existingUser) {
        throw new UnauthorizedException('User with this email already exists');
      }
      const newUser = await prisma.user.create({
        data: {
          name: props.name,
          email: props.email,
          password: hashedPassword,
        },
      }).catch(error => {
        throw new BusinessException('Error creating user', error.stack);
      });

      const payload: LoginPayload = {
        sub: newUser.id,
        email: newUser.email,
      };
  
      const accessToken = this.jwtService.sign(payload);
  
      const { password, ...userWithoutPassword } = newUser;
  
      return {
        user: {
          ...userWithoutPassword
        },
        accessToken,
      };

    } catch (error) {
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.findOneByEmail(email);
    if (!user) return null;
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async findOneByEmail(email: string): Promise<any> {
    return prisma.user.findFirst({
      where: { email },
    })
  }
}
