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
  constructor(message?: string) {
    super(message || 'Este e-mail já está em uso por outra conta.');
    this.name = 'UserAlreadyExistsError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('Não autorizado');
    this.name = 'UnauthorizedError';
  }
}

export class UserBannedError extends AuthError {
  constructor(message?: string) {
    super(message || 'Sua conta está suspensa. Entre em contato com o suporte.');
    this.name = 'UserBannedError';
  }
}

