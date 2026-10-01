import { getRequiredSession } from "@/infrastructure/auth/getRequiredSession";
import SessionRefresher from "@/components/SessionRefresher";
import Navbar from "@/components/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protege o primeiro carregamento; cada página também chama getRequiredSession()
  await getRequiredSession();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-indigo-500 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <SessionRefresher />
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
    </div>
  );
}
