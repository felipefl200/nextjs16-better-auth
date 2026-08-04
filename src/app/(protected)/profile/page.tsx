import { getRequiredSession } from "@/src/infrastructure/auth/getRequiredSession";
import { Card, Badge } from "@/src/components/ui";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getRequiredSession();
  const userDTO = session.user.toDTO();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
        <p className="text-gray-400">Informações e detalhes da sua conta</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Avatar Card */}
        <Card className="flex flex-col items-center text-center h-fit">
          <div className="w-24 h-24 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/20 mb-4 border-2 border-indigo-400/30">
            {getInitials(userDTO.name || "User")}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {userDTO.name}
          </h2>
          <p className="text-gray-400 text-sm mb-4">{userDTO.email}</p>

          <Badge variant="success" pill>
            Autenticado via Better Auth
          </Badge>
        </Card>

        {/* Detailed Editable Information */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileForm user={userDTO} />

          {/* Technical Info Card */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
              Detalhes Arquiteturais da Sessão
            </h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>
                ✓ A autorização desta rota foi herdada pelo{" "}
                <code className="text-indigo-400">layout.tsx</code> em{" "}
                <code className="text-indigo-400">app/(protected)</code>.
              </p>
              <p>
                ✓ A sessão foi resolvida via{" "}
                <code className="text-indigo-400">getRequiredSession()</code>{" "}
                reutilizando a memoização do Next.js.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
