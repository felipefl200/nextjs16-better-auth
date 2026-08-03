import { cookies } from 'next/headers';
import { FetchAdminGateway } from './FetchAdminGateway';

export async function createServerAdminGateway() {
  const cookieStore = await cookies();
  const allCookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  return new FetchAdminGateway({
    baseUrl: `${process.env.API_URL || 'http://localhost:3001'}/api/auth`,
    headers: {
      Cookie: allCookies,
    },
  });
}
