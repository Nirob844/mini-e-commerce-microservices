import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  VerifyTokenDto,
  RegisterDto,
} from './dtos/auth.dto';

interface CreateSessionRequest {
  userId: string;
  username: string;
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Note: In a real scenario, password verification would happen here
    // For now, we're creating a session with the provided username
    return this.authService.login(loginDto, '');
  }

  @Post('create-session')
  async createSession(@Body() body: CreateSessionRequest) {
    return this.authService.createSession(
      body.userId,
      body.username,
      body.email,
    );
  }

  @Post('verify')
  async verify(@Body() verifyTokenDto: VerifyTokenDto) {
    return this.authService.verifyToken(verifyTokenDto.token);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return { message: 'No token provided' };
    }
    return this.authService.logout(token);
  }

  @Get('health')
  health() {
    return { status: 'Auth Service is running' };
  }
}
