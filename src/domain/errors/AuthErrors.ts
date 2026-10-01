export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("Email ou senha inválidos");
    this.name = "InvalidCredentialsError";
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor() {
    super("Usuário já cadastrado");
    this.name = "UserAlreadyExistsError";
  }
}

export class WeakPasswordError extends AuthError {
  constructor() {
    super("A senha não atende aos requisitos de tamanho");
    this.name = "WeakPasswordError";
  }
}

export class InvalidEmailError extends AuthError {
  constructor() {
    super("Endereço de e-mail inválido");
    this.name = "InvalidEmailError";
  }
}

export class NetworkError extends AuthError {
  constructor() {
    super("Não foi possível conectar ao servidor. Verifique sua conexão.");
    this.name = "NetworkError";
  }
}

export class UnauthorizedError extends AuthError {
  constructor() {
    super("Não autorizado");
    this.name = "UnauthorizedError";
  }
}
