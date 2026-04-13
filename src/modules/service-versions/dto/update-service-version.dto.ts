import { IsString } from 'class-validator';

export class UpdateServiceVersionDto {
  @IsString()
  name: string;
}
