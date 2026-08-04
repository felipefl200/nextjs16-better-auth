import { AuthGateway, ActiveSession } from '../ports/AuthGateway';

export class ListSessionsUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(): Promise<ActiveSession[]> {
    return this.authGateway.listSessions();
  }
}
