import { AuthGateway } from '../ports/AuthGateway';

export class LoginUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(email: string, password: string): Promise<void> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }
    await this.authGateway.login(email, password);
  }
}
