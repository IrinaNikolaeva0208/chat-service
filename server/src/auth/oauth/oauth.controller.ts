import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { GoogleOauthGuard } from '../guards/googleOauth.guard';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { AuthDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async execGoogleCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.signTokens(
      req.user as AuthDto,
    );
    await this.authService.createGoogleIfNotExists(req.user as AuthDto);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    res.sendStatus(HttpStatus.OK);
  }
}
