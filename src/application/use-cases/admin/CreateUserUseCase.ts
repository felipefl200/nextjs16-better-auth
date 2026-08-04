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
    if (input.password.length < 8) {
      throw new Error('A senha deve ter no mínimo 8 caracteres');
    }
    return this.adminGateway.createUser(input);
  }
}
