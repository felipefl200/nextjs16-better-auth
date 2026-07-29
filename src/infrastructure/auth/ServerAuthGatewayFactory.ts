import { cookies } from 'next/headers';
import { FetchAuthGateway } from './FetchAuthGateway';

export async function createServerAuthGateway() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  return new FetchAuthGateway({
    baseUrl: `${process.env.API_URL || 'http://localhost:3001'}/api/auth`,
    headers: {
      Cookie: allCookies,
    },
  });
}
