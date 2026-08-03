import { User } from '@/src/domain/entities/User';
import { AdminGateway } from '../../ports/AdminGateway';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export class CreateUserUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(input: CreateUserInput): Promise<User> {
    if (!input.email || !input.password || !input.name) {
      throw new Error('email, password e name são obrigatórios');
    }
    return this.adminGateway.createUser(input);
  }
}
