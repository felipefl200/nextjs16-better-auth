import { AuthGateway, EnableTwoFactorResult } from '../ports/AuthGateway';

export class EnableTwoFactorUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(password: string): Promise<EnableTwoFactorResult> {
    if (!password) {
      throw new Error('A senha é obrigatória para habilitar o 2FA');
    }
    return this.authGateway.enableTwoFactor(password);
  }
}
