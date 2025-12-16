import { IsString, IsOptional } from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  degree?: string;
}
