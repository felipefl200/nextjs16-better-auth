import { AuthGateway } from "../ports/AuthGateway";

export interface UpdateProfileParams {
  name?: string;
  email?: string;
}

export class UpdateProfileUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(params: UpdateProfileParams): Promise<void> {
    if (params.name !== undefined && !params.name.trim()) {
      throw new Error("O nome completo não pode ficar em branco.");
    }
    if (params.email !== undefined && !params.email.trim()) {
      throw new Error("O endereço de e-mail não pode ficar em branco.");
    }
    await this.authGateway.updateProfile(params);
  }
}
