import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  accent: "indigo" | "purple";
};

const glows = {
  indigo: ["bg-indigo-500/30", "bg-fuchsia-500/20"],
  purple: ["bg-purple-500/30", "bg-blue-500/20"],
};

export default function AuthCard({ title, description, children, footer, accent }: AuthCardProps) {
  const [primaryGlow, secondaryGlow] = glows[accent];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden px-4">
      <div aria-hidden="true" className={`absolute top-[-20%] left-[-10%] w-96 h-96 ${primaryGlow} rounded-full blur-[120px]`} />
      <div aria-hidden="true" className={`absolute bottom-[-20%] right-[-10%] w-96 h-96 ${secondaryGlow} rounded-full blur-[120px]`} />

      <section
        aria-labelledby="auth-title"
        className="relative z-10 w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl"
      >
        <header className="mb-8 text-center">
          <h1 id="auth-title" className="text-3xl font-bold text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-400">{description}</p>
        </header>

        {children}

        <footer className="mt-6 text-center text-gray-400 text-sm">{footer}</footer>
      </section>
    </main>
  );
}
