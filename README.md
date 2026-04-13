# Service Catalog API

A multi-tenant REST API for managing a service catalog. Built with [NestJS v9](https://docs.nestjs.com/v9) and PostgreSQL via TypeORM.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

## Getting started

1. Clone the repo
2. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
3. Start the app and database:
   ```bash
   docker compose up --build
   ```

The app runs on `http://localhost:3000`. Migrations run automatically on startup.

4. Seed the database:
   ```bash
   npm run seed:local
   ```
   This creates a seed organization with a fixed ID you can use straight away:
   ```
   a0000000-0000-0000-0000-000000000001
   ```

## Scripts

**Development**
```bash
docker compose up --build       # start app + postgres
docker compose rm -svf app      # stop and remove the app container
```

**Migrations**
```bash
npm run migration:generate src/migrations/<Name>  # generate a migration from entity changes
npm run migration:run                              # run pending migrations
npm run migration:revert                           # revert the last migration
```

**Seed**
```bash
npm run seed:local   # seed 1 org, 1 user, 10 services with versions (dev only)
```

**Tests**
```bash
npm run test         # unit tests
npm run test:e2e     # end-to-end tests
npm run test:cov     # test coverage
```

## API endpoints

All routes are scoped to an organization. Replace `:orgId` and `:id` with UUIDs.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/organizations/:orgId/services` | List services (supports filtering, sorting, pagination) |
| GET | `/organizations/:orgId/services/:id` | Get a single service |
| GET | `/organizations/:orgId/services/:id/versions` | List versions for a service |

**Query params for list endpoint**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | — | Filter by name (case-insensitive, partial match) |
| `sortBy` | `name` \| `createdAt` | `name` | Field to sort by |
| `sortOrder` | `asc` \| `desc` | `asc` | Sort direction |
| `page` | number | `1` | Page number (1-indexed) |
| `limit` | number | `20` | Page size (max 100) |

**Example**
```bash
curl "http://localhost:3000/organizations/a0000000-0000-0000-0000-000000000001/services?search=auth&sortBy=name&sortOrder=asc&page=1&limit=10"

// Sample response
{
  "data": [
    {
      "id": "035f3840-8e88-43a0-b1c4-319b77accca7",
      "organizationId": "a0000000-0000-0000-0000-000000000001",
      "name": "Authentication Service",
      "description": "Description for Authentication Service",
      "activeVersionId": "0ef94ea8-a659-4b29-8d82-ceda7c712755",
      "createdAt": "2026-04-13T03:40:16.906Z",
      "updatedAt": "2026-04-13T03:40:16.915Z",
      "versionCount": 2
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

## Resetting the database

```bash
docker compose exec postgres psql -U nest -d nest_demo -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
docker compose rm -svf app && docker compose up --build
```
