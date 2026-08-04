"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserDTO } from "@/src/domain/entities/User";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { UpdateProfileUseCase } from "@/src/application/use-cases/UpdateProfileUseCase";
import { Card, Input, Button, Alert, Badge } from "@/src/components/ui";

interface ProfileFormProps {
  user: UserDTO;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const hasNameChanged = name.trim() !== user.name;
    const hasEmailChanged = email.trim() !== user.email;

    // Se nenhuma alteração foi feita
    if (!hasNameChanged && !hasEmailChanged) {
      setMessage({
        type: "danger",
        text: "Nenhuma alteração foi realizada.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const gateway = new FetchAuthGateway();
      const useCase = new UpdateProfileUseCase(gateway);
      await useCase.execute({
        name: hasNameChanged ? name.trim() : undefined,
        email: hasEmailChanged ? email.trim() : undefined,
      });

      setMessage({
        type: "success",
        text: "Perfil atualizado com sucesso!",
      });
      router.refresh();
    } catch (err: unknown) {
      setMessage({
        type: "danger",
        text: err instanceof Error ? err.message : "Erro ao atualizar perfil.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
          Dados da Conta
        </h3>

        {message && (
          <Alert variant={message.type} className="mb-4">
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo Editável: Nome */}
            <Input
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />

            {/* Campo Editável: E-mail */}
            <Input
              label="Endereço de E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            {/* Campo Somente Leitura: ID do Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID do Usuário <span className="text-xs text-gray-500 font-normal">(Somente Leitura)</span>
              </label>
              <div className="px-4 py-3 bg-gray-950/60 border border-gray-800/60 rounded-xl text-xs font-mono text-gray-400 select-all break-all cursor-not-allowed">
                {user.id}
              </div>
            </div>

            {/* Campo Somente Leitura: Status da Conta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status da Conta <span className="text-xs text-gray-500 font-normal">(Somente Leitura)</span>
              </label>
              <div className="px-4 py-2.5 bg-gray-950/60 border border-gray-800/60 rounded-xl text-sm flex items-center justify-between cursor-not-allowed">
                <span className="text-gray-300 font-medium">Conta Verificada</span>
                {user.banned ? (
                  <Badge variant="danger">Suspensa</Badge>
                ) : (
                  <Badge variant="success">Ativa</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-800/60">
            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              size="md"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
