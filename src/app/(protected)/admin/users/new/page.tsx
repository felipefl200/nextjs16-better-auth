"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Input, Button, Alert } from "@/src/components/ui";
import { FetchAdminGateway } from "@/src/infrastructure/admin/FetchAdminGateway";
import { CreateUserUseCase } from "@/src/application/use-cases/admin/CreateUserUseCase";

export default function NewUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const gateway = new FetchAdminGateway();
      const useCase = new CreateUserUseCase(gateway);
      await useCase.execute({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      router.push("/admin/users");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto p-8 shadow-xl">
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-white">Cadastrar Novo Usuário</h2>
        <Link
          href="/admin/users"
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          ← Voltar
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nome Completo"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do usuário"
        />

        <Input
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
        />

        <Input
          label="Senha Inicial"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Role (Papel no sistema)
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm input-field outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="user">User (Usuário Padrão)</option>
            <option value="admin">Admin (Administrador)</option>
          </select>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          variant="primary"
          fullWidth
          size="lg"
        >
          {loading ? "Cadastrando..." : "Criar Usuário"}
        </Button>
      </form>
    </Card>
  );
}
