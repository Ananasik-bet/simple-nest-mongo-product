import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    const dbUser = await this.usersService.create(user);

    const payload = { email: dbUser.email, userId: dbUser._id.toString() };
    const tokens = this.genTokens(payload);
    return { ...tokens, ...payload };
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, userId: user._id.toString() };
    const tokens = this.genTokens(payload);
    return { ...tokens, ...payload };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const payload = { email: decoded.email, userId: decoded.userId };
      return this.genTokens(payload);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Check if user exist, compare password.
   * @param email: string
   * @param pass: string
   * @returns Promise<User> | null
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private genTokens(payload: { email: string; userId: string }) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }
}
