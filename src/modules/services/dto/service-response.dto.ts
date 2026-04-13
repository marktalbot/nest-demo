export class ServiceVersionSummaryDto {
  id: string;
  name: string;
  createdAt: Date;
}

export class ServiceResponseDto {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  activeVersionId: string | null;
  versionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceDetailResponseDto {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  activeVersionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedServicesResponseDto {
  data: ServiceResponseDto[];
  total: number;
  page: number;
  limit: number;
}
