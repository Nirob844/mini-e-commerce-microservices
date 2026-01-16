import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos/user.dto';
import { NotFoundException } from '@mini-e-commerce/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, ...rest } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        email,
        password: hashedPassword,
      },
    });

    return this.mapUserToResponse(user);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User', id);
    }

    return this.mapUserToResponse(user);
  }

  async getAllUsers(skip: number = 0, take: number = 10) {
    const users = await this.prisma.user.findMany({
      skip,
      take,
    });

    const total = await this.prisma.user.count();

    return {
      data: users.map((user) => this.mapUserToResponse(user)),
      total,
      skip,
      take,
    };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User', id);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.mapUserToResponse(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User', id);
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async validateUserPassword(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return this.mapUserToResponse(user);
  }

  private mapUserToResponse(user: Omit<any, 'password'>): UserResponseDto {
    const { ...response } = user;
    return response as UserResponseDto;
  }
}
