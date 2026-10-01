import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/infrastructure/auth/constants";

export default function Home() {
  redirect(LOGIN_PATH);
}
