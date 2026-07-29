export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Email ou senha inválidos');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor() {
    super('Usuário já cadastrado');
    this.name = 'UserAlreadyExistsError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('Não autorizado');
    this.name = 'UnauthorizedError';
  }
}
