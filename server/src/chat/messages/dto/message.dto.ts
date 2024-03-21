import { IsString, IsNotEmpty } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
