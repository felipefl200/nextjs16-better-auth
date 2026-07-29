import { Session } from '../../domain/entities/Session';
import { AuthGateway } from '../ports/AuthGateway';

export class GetSessionUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(): Promise<Session | null> {
    return this.authGateway.getSession();
  }
}
