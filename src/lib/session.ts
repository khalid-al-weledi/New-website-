import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as { id: string; role: Role; name?: string; email?: string } | undefined;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect('/login?error=forbidden');
  return user;
}