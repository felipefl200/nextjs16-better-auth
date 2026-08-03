import { AdminGateway, ListUsersParams, ListUsersResult } from '../../ports/AdminGateway';

export class ListUsersUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(params?: ListUsersParams): Promise<ListUsersResult> {
    return this.adminGateway.listUsers(params);
  }
}
