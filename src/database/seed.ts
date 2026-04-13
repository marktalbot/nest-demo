import 'reflect-metadata';

if (process.env.NODE_ENV !== 'development') {
  console.error(
    'Seed script can only run in development environment. Aborting.',
  );
  process.exit(1);
}

import { AppDataSource } from '../data-source';
import { Organization } from '../modules/organizations/organization.entity';
import { User } from '../modules/users/user.entity';
import { Service } from '../modules/services/service.entity';
import { ServiceVersion } from '../modules/service-versions/service-version.entity';

const SEED_ORG_NAME = 'Seed Organization';

const SERVICE_NAMES = [
  'Authentication Service',
  'Payment Gateway',
  'Notification Service',
  'User Management',
  'Analytics Engine',
  'Search Service',
  'File Storage',
  'Email Service',
  'Audit Logger',
  'API Gateway',
];

async function seed() {
  await AppDataSource.initialize();

  const orgRepo = AppDataSource.getRepository(Organization);
  const userRepo = AppDataSource.getRepository(User);
  const serviceRepo = AppDataSource.getRepository(Service);
  const versionRepo = AppDataSource.getRepository(ServiceVersion);

  // Clear existing seed data
  const existingOrg = await orgRepo.findOne({ where: { name: SEED_ORG_NAME } });
  if (existingOrg) {
    const services = await serviceRepo.find({
      where: { organizationId: existingOrg.id },
    });
    for (const service of services) {
      await versionRepo.delete({ serviceId: service.id });
      await serviceRepo.update(service.id, { activeVersionId: null });
    }
    await serviceRepo.delete({ organizationId: existingOrg.id });
    await userRepo.delete({ email: 'seed@example.com' });
    await orgRepo.delete(existingOrg.id);
  }

  // Organization
  const org = await orgRepo.save(orgRepo.create({ name: SEED_ORG_NAME }));

  // User
  await userRepo.save(
    userRepo.create({
      name: 'Seed User',
      email: 'seed@example.com',
      password: 'hashed_password_placeholder',
    }),
  );

  // Services + versions
  for (const serviceName of SERVICE_NAMES) {
    const service = await serviceRepo.save(
      serviceRepo.create({
        organizationId: org.id,
        name: serviceName,
        description: `Description for ${serviceName}`,
      }),
    );

    const versionCount = Math.random() < 0.5 ? 1 : 2;
    let lastVersion: ServiceVersion | null = null;

    for (let i = 1; i <= versionCount; i++) {
      lastVersion = await versionRepo.save(
        versionRepo.create({
          organizationId: org.id,
          serviceId: service.id,
          name: `v${i}.0.0`,
        }),
      );
    }

    await serviceRepo.update(service.id, { activeVersionId: lastVersion!.id });
  }

  console.log(`Seeded: 1 org, 1 user, ${SERVICE_NAMES.length} services`);
  console.log(`Organization ID: ${org.id}`);

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
