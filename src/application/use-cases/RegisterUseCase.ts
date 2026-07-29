import { AuthGateway } from '../ports/AuthGateway';

export class RegisterUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(email: string, password: string, name: string): Promise<void> {
    if (!email || !password || !name) {
      throw new Error('Todos os campos são obrigatórios');
    }
    await this.authGateway.register(email, password, name);
  }
}
