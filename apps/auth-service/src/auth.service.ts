/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoginDto, AuthResponseDto, RegisterDto } from './dtos/auth.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // In a real scenario, this would be coordinated with user-service
    // For now, we generate token and create session
    const userId = this.generateUserId();
    const token = this.generateToken(userId);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return {
      id: userId,
      username: registerDto.username,
      email: registerDto.email,
      token,
      expiresAt,
    };
  }

  async login(loginDto: LoginDto, userId: string): Promise<AuthResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }

    const token = this.generateToken(userId);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return {
      id: userId,
      username: loginDto.username,
      email: '',
      token,
      expiresAt,
    };
  }

  async createSession(
    userId: string,
    username: string,
    email: string,
  ): Promise<AuthResponseDto> {
    const token = this.generateToken(userId);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return {
      id: userId,
      username,
      email,
      token,
      expiresAt,
    };
  }

  async verifyToken(token: string) {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secret) as { userId: string };

      const session = await this.prisma.session.findUnique({
        where: { token },
      });

      if (!session || new Date() > session.expiresAt) {
        throw new UnauthorizedException('Token expired or invalid');
      }

      return { userId: decoded.userId, valid: true };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(token: string) {
    try {
      await this.prisma.session.delete({
        where: { token },
      });
      return { message: 'Logged out successfully' };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign({ userId }, secret, { expiresIn: '24h' });
  }

  private generateUserId(): string {
    return `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
