import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private hashTokenWithSha256(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
        type: 'refresh',
      },
      {
        expiresIn: '30d',
      },
    );

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const tokenSha = this.hashTokenWithSha256(tokens.refreshToken);
    const hashedRefreshToken = await bcrypt.hash(tokenSha, 10);

    await this.usersRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        user_id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    let payload: { sub: string; type: string };
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        'User no longer exists or session revoked',
      );
    }

    const tokenSha = this.hashTokenWithSha256(refreshToken);
    const compareRefreshToken = await bcrypt.compare(
      tokenSha,
      user.refreshToken,
    );

    if (!compareRefreshToken) {
      await this.usersRepository.update(user.id, {
        refreshToken: null,
      });
      throw new UnauthorizedException(
        'Invalid or reused refresh token. Session revoked.',
      );
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const newTokenSha = this.hashTokenWithSha256(tokens.refreshToken);
    const hashedRefreshToken = await bcrypt.hash(newTokenSha, 10);

    await this.usersRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      message: 'Tokens refreshed successfully',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
