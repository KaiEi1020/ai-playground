import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;
}
