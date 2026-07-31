"use client";

import { useRouter } from "next/navigation";
import { LogoutUseCase } from "@/src/application/use-cases/LogoutUseCase";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const gateway = new FetchAuthGateway();
      const logoutUseCase = new LogoutUseCase(gateway);
      await logoutUseCase.execute();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Erro no logout", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all font-medium text-sm"
    >
      Sair
    </button>
  );
}
