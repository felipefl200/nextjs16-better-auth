import { getRequiredSession } from "@/src/infrastructure/auth/getRequiredSession";
import SessionRefresher from "./SessionRefresher";
import Navbar from "./Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRequiredSession();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <SessionRefresher />
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
