import { AuthGateway } from '../ports/AuthGateway';

export class LogoutUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(): Promise<void> {
    await this.authGateway.logout();
  }
}
