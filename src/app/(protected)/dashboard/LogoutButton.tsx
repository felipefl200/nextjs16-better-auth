"use client";

import { useRouter } from "next/navigation";
import { LogoutUseCase } from "@/src/application/use-cases/LogoutUseCase";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { Button } from "@/src/components/ui";

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
    <Button onClick={handleLogout} variant="danger-outline" size="sm">
      Sair
    </Button>
  );
}
