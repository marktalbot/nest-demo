import { IsOptional, IsString } from 'class-validator';

export class UpdateServiceVersionDto {
  @IsOptional()
  @IsString()
  name?: string;
}
