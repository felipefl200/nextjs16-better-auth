import { AuthGateway } from '../ports/AuthGateway';

export class AuthenticateTwoFactorUseCase {
  constructor(private authGateway: AuthGateway) {}

  async executeTotp(code: string, trustDevice?: boolean): Promise<void> {
    if (!code) {
      throw new Error('Informe o código de 6 dígitos');
    }
    await this.authGateway.authenticateTotp(code, trustDevice);
  }

  async executeBackupCode(code: string, trustDevice?: boolean): Promise<void> {
    if (!code) {
      throw new Error('Informe o código de backup');
    }
    await this.authGateway.authenticateBackupCode(code, trustDevice);
  }
}
