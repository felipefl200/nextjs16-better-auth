"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Perfil", href: "/profile" },
  { label: "Configurações", href: "/settings" },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900/60 border-b border-gray-800 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="flex items-center space-x-2" aria-label="NextBetterAuth — página inicial">
            <span
              aria-hidden="true"
              className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20"
            >
              N
            </span>
            <span className="font-bold text-white tracking-wide">NextBetterAuth</span>
          </Link>

          <nav aria-label="Principal">
            <ul className="flex items-center space-x-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
