import { getRequiredAdminSession } from '@/src/infrastructure/auth/getRequiredAdminSession';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRequiredAdminSession();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
              Painel Administrativo
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Governança & Administração
          </h1>
        </div>

        <nav className="flex space-x-2 bg-gray-900/60 p-1.5 rounded-xl border border-gray-800">
          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all"
          >
            Visão Geral
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all"
          >
            Usuários
          </Link>
          <Link
            href="/admin/users/new"
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20"
          >
            + Novo Usuário
          </Link>
        </nav>
      </div>

      <main>{children}</main>
    </div>
  );
}
