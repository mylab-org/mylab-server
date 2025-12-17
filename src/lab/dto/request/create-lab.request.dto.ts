import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateLabRequestDto {
  @IsString()
  @MinLength(2)
  schoolName: string;

  @IsOptional()
  @IsOptional()
  departmentName: string;

  @IsString()
  @MinLength(2)
  labName: string;
}
