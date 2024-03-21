import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  provider?: string;
}
