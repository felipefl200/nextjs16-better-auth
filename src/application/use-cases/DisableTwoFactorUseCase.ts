import { AuthGateway } from '../ports/AuthGateway';

export class DisableTwoFactorUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(password: string): Promise<void> {
    if (!password) {
      throw new Error('Informe sua senha para desabilitar o 2FA');
    }
    await this.authGateway.disableTwoFactor(password);
  }
}
