import { AdminGateway } from '../../ports/AdminGateway';

const VALID_ROLES = ['user', 'admin'];

export class SetUserRoleUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(userId: string, role: string): Promise<void> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Role inválida: ${role}. Roles permitidas: ${VALID_ROLES.join(', ')}`);
    }
    return this.adminGateway.setRole(userId, role);
  }
}
