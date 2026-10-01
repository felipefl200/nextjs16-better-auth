import { ValidationError } from "@/domain/errors/AuthErrors";
import { AuthGateway } from "../ports/AuthGateway";

export class LoginUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(email: string, password: string): Promise<void> {
    if (!email.trim() || !password) {
      throw new ValidationError("Email e senha são obrigatórios");
    }
    await this.authGateway.login(email.trim(), password);
  }
}
