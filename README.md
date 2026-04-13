# Service Catalog API

A multi-tenant REST API for managing a service catalog. Built with [NestJS v9](https://docs.nestjs.com/v9) and PostgreSQL via TypeORM.

## Table of contents

- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [API endpoints](#api-endpoints)
- [Design tradeoffs](#design-tradeoffs)
- [Assumptions](#assumptions)
- [Future Improvements](#future-improvements)
- [Resetting the database](#resetting-the-database)

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

All routes are scoped to an organization. Replace `:orgId`, `:id`, and `:versionId` with UUIDs.

**Services**

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/organizations/:orgId/services` | List services (supports filtering, sorting, pagination) |
| GET | `/organizations/:orgId/services/:id` | Get a single service |
| POST | `/organizations/:orgId/services` | Create a service |
| PATCH | `/organizations/:orgId/services/:id` | Update a service (name, description, activeVersionId) |
| DELETE | `/organizations/:orgId/services/:id` | Delete a service and all its versions |

**Service versions**

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/organizations/:orgId/services/:id/versions` | List versions for a service |
| POST | `/organizations/:orgId/services/:id/versions` | Create a version |
| PATCH | `/organizations/:orgId/services/:id/versions/:versionId` | Update a version's name |
| DELETE | `/organizations/:orgId/services/:id/versions/:versionId` | Delete a version (clears activeVersionId if it was active) |

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

## Design tradeoffs

| Decision | Reasoning |
|----------|-----------|
| Active version stored as a FK on `services`, not a flag on `service_versions` | Enforces one active version per service at the schema level (because only one "slot" exists). Alternative (`is_active` boolean on the `service_versions` record) would need a partial unique index and app-level logic to unset the previous active version.<br><br>Tradeoff: circular FK between the two tables, managed by making the column nullable. |
| `organizationId` on every table | Keeps tenant-scoped queries simple without joins, even though the org is reachable via `serviceId → services.organizationId`.<br><br>Tradeoff: risk of inconsistency if a service's org ever changes is accepted as low. |
| Service versions are fetched via a separate endpoint, not included in the single service response | A service could accumulate many versions over time. Inlining them would make the payload unbounded. The dedicated `GET .../versions` endpoint can have pagination added independently if needed.<br><br>Tradeoff: clients that need both the service detail and its versions must make two requests. |
| camelCase column names | TypeORM's default convention, avoids adding a naming strategy dependency.<br><br>Tradeoff: non-standard for Postgres — can be surprising when querying the DB directly. |

## Assumptions

- The API is read-only — no create/update/delete endpoints
- The caller already knows the `orgId` — no endpoint exists to resolve it from a user
- No authentication layer — org scoping is enforced by the URL param, not a token or session
- A service belongs to exactly one organization — no cross-org sharing
- Version names are free-form strings (e.g. `v1.0.0`) — no semver enforcement
- A service can have at most one active version — `activeVersionId` is null until one is set
- The `users` table exists for future auth but is not used by the current API
- Passwords are not hashed in the seed — placeholder only, a real auth layer will handle hashing

## Future improvements

- **Postgres Row Level Security (RLS):** for hard tenant isolation guarantees, RLS enforces org scoping at the database level regardless of application code. A session variable (`app.current_org_id`) is set before each query and Postgres automatically filters all reads/writes.
- **Pagination on the versions endpoint:** `GET .../versions` currently returns all versions for a service. Adding `page`/`limit` params would be needed if services accumulate a large number of versions.
- **Creation of Swagger API docs:** For improved developer experience when working with the API.

## Resetting the database

```bash
docker compose exec postgres psql -U nest -d nest_demo -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
docker compose rm -svf app && docker compose up --build
```
