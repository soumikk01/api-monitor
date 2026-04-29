/**
 * One-time backfill: generate sdkToken for all existing services that don't have one.
 * Run with: npx ts-node --project tsconfig.json src/scripts/backfill-service-tokens.ts
 */
import { PrismaClient } from '../generated/prisma';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Find services where sdkToken field is not set (MongoDB: field doesn't exist or is null)
  const allServices = await prisma.service.findMany();
  const services = allServices.filter((s) => !s.sdkToken);

  if (services.length === 0) {
    console.log('✅ All services already have SDK tokens.');
    return;
  }

  console.log(`Backfilling ${services.length} service(s)…`);
  for (const svc of services) {
    const token = `sdk_${randomBytes(24).toString('hex')}`;
    await prisma.service.update({
      where: { id: svc.id },
      data: { sdkToken: token },
    });
    console.log(`  ✓ ${svc.name} (${svc.id}) → ${token}`);
  }
  console.log('Done.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
