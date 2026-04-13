import { IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateIf((o) => o.activeVersionId !== null)
  @IsOptional()
  @IsUUID()
  activeVersionId?: string | null;
}
