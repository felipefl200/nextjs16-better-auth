import { AuthGateway } from '../ports/AuthGateway';

export class RevokeSessionUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(sessionToken: string): Promise<void> {
    if (!sessionToken) {
      throw new Error('sessionToken é obrigatório');
    }
    return this.authGateway.revokeSession(sessionToken);
  }
}
