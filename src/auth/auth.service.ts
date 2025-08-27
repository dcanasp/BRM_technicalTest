import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../Domain/Entities/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Partial<User>> {
    const newUser = await this.usersService.create({
      username: registerDto.username,
      password: registerDto.password,
      role: UserRole.CLIENT, // Los usuarios registrados por defecto son Clientes
    });
    const { password, ...result } = newUser.toJSON();
    return result;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(loginDto.username);
    console.log(user?.password);
    if (!user || !(await User.validatePassword(loginDto.password, user))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}