import { AdminGateway } from '../../ports/AdminGateway';

export class RevokeUserSessionUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(sessionToken: string): Promise<void> {
    if (!sessionToken) {
      throw new Error('sessionToken é obrigatório');
    }
    return this.adminGateway.revokeUserSession(sessionToken);
  }
}
