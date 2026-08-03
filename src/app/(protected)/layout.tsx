import { getRequiredSession } from "@/src/infrastructure/auth/getRequiredSession";
import SessionRefresher from "./SessionRefresher";
import Navbar from "./Navbar";
import ImpersonationBanner from "./ImpersonationBanner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getRequiredSession();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <ImpersonationBanner
        impersonatedBy={session.impersonatedBy}
        targetUserName={session.user.name}
      />
      <SessionRefresher />
      <Navbar isAdmin={session.user.isAdmin} />
      <main>{children}</main>
    </div>
  );
}
