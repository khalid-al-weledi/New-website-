import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const [email, fullName, password] = process.argv.slice(2);
  if (!email || !fullName || !password) {
    console.error('Usage: npm run create-admin -- <email> "<full name>" <password>');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error('❌ Password must be at least 10 characters.');
    process.exit(1);
  }
  const existing = await prisma.user.findFirst({ where: { role: Role.SUPER_ADMIN } });
  if (existing) {
    console.error('❌ A SUPER_ADMIN already exists:', existing.email);
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, fullName, passwordHash, role: Role.SUPER_ADMIN },
  });
  console.log('✅ Super admin created:', user.email);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());