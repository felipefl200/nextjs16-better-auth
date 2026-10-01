import { ValidationError } from "@/domain/errors/AuthErrors";
import { AuthGateway } from "../ports/AuthGateway";

export class RegisterUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(email: string, password: string, name: string): Promise<void> {
    if (!email.trim() || !password || !name.trim()) {
      throw new ValidationError("Todos os campos são obrigatórios");
    }
    await this.authGateway.register(email.trim(), password, name.trim());
  }
}
