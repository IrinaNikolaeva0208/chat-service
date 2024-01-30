import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class MessageDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  event: string;
}
