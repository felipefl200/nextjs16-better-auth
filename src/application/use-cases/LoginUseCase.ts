import { AuthGateway } from '../ports/AuthGateway';

export class LoginUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(email: string, password: string): Promise<{ twoFactorRedirect?: boolean }> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }
    return this.authGateway.login(email, password);
  }
}
