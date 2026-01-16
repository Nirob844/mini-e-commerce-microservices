import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.userService.getAllUsers(skip, take);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  // Message pattern for microservice communication
  @MessagePattern({ cmd: 'get_user' })
  async handleGetUser(data: { id: string }) {
    return this.userService.getUserById(data.id);
  }

  @MessagePattern({ cmd: 'validate_user' })
  async handleValidateUser(data: { email: string; password: string }) {
    return this.userService.validateUserPassword(data.email, data.password);
  }
}
