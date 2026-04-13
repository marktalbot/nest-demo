import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceVersionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
