import { describe, expect, it, vi } from "vitest";
import type { AuthGateway } from "@/application/ports/AuthGateway";
import { ValidationError } from "@/domain/errors/AuthErrors";
import { LoginUseCase } from "./LoginUseCase";
import { RegisterUseCase } from "./RegisterUseCase";
import { LogoutUseCase } from "./LogoutUseCase";
import { GetSessionUseCase } from "./GetSessionUseCase";

function fakeGateway(): AuthGateway {
  return {
    login: vi.fn().mockResolvedValue(undefined),
    register: vi.fn().mockResolvedValue(undefined),
    getSession: vi.fn().mockResolvedValue(null),
    logout: vi.fn().mockResolvedValue(undefined),
  };
}

describe("LoginUseCase", () => {
  it("rejeita campos vazios sem chamar o gateway", async () => {
    const gateway = fakeGateway();
    await expect(new LoginUseCase(gateway).execute("  ", "x")).rejects.toBeInstanceOf(ValidationError);
    await expect(new LoginUseCase(gateway).execute("a@b.com", "")).rejects.toBeInstanceOf(ValidationError);
    expect(gateway.login).not.toHaveBeenCalled();
  });

  it("delega ao gateway com e-mail normalizado", async () => {
    const gateway = fakeGateway();
    await new LoginUseCase(gateway).execute(" a@b.com ", "secret");
    expect(gateway.login).toHaveBeenCalledWith("a@b.com", "secret");
  });
});

describe("RegisterUseCase", () => {
  it("rejeita nome vazio", async () => {
    const gateway = fakeGateway();
    await expect(new RegisterUseCase(gateway).execute("a@b.com", "secret", " ")).rejects.toBeInstanceOf(
      ValidationError,
    );
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it("delega ao gateway", async () => {
    const gateway = fakeGateway();
    await new RegisterUseCase(gateway).execute("a@b.com", "secret123", " Ana ");
    expect(gateway.register).toHaveBeenCalledWith("a@b.com", "secret123", "Ana");
  });
});

describe("LogoutUseCase / GetSessionUseCase", () => {
  it("delegam ao gateway", async () => {
    const gateway = fakeGateway();
    await new LogoutUseCase(gateway).execute();
    expect(gateway.logout).toHaveBeenCalled();
    await expect(new GetSessionUseCase(gateway).execute()).resolves.toBeNull();
  });
});
