export class AdminError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminError';
  }
}

export class ForbiddenError extends AdminError {
  constructor() {
    super('Acesso negado. Permissão administrativa necessária.');
    this.name = 'ForbiddenError';
  }
}
