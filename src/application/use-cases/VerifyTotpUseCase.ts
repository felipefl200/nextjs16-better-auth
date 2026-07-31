import { AuthGateway } from '../ports/AuthGateway';

export class VerifyTotpUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(code: string): Promise<void> {
    if (!code || code.length !== 6) {
      throw new Error('Informe o código de 6 dígitos válido');
    }
    await this.authGateway.verifyTotp(code);
  }
}
