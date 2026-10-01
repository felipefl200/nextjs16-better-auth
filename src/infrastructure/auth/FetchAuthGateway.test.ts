import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AuthError,
  InvalidCredentialsError,
  InvalidEmailError,
  NetworkError,
  UserAlreadyExistsError,
  WeakPasswordError,
} from "@/domain/errors/AuthErrors";
import { FetchAuthGateway } from "./FetchAuthGateway";

function mockFetch(status: number, body: unknown) {
  const fn = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("FetchAuthGateway", () => {
  const gateway = new FetchAuthGateway({ baseUrl: "http://api/api/auth" });

  it.each([
    [401, { code: "INVALID_EMAIL_OR_PASSWORD" }, InvalidCredentialsError],
    [400, { code: "INVALID_EMAIL" }, InvalidEmailError],
    [500, {}, AuthError],
  ])("login: status %i %o → erro de domínio", async (status, body, ErrorType) => {
    mockFetch(status, body);
    await expect(gateway.login("a@b.com", "x")).rejects.toBeInstanceOf(ErrorType);
  });

  it.each([
    [422, { code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" }, UserAlreadyExistsError],
    [422, { code: "USER_ALREADY_EXISTS" }, UserAlreadyExistsError],
    [400, { code: "PASSWORD_TOO_SHORT" }, WeakPasswordError],
    [400, { code: "PASSWORD_TOO_LONG" }, WeakPasswordError],
  ])("register: status %i %o → erro de domínio", async (status, body, ErrorType) => {
    mockFetch(status, body);
    await expect(gateway.register("a@b.com", "x", "Ana")).rejects.toBeInstanceOf(ErrorType);
  });

  it("envia JSON e credenciais no login", async () => {
    const fetchMock = mockFetch(200, {});
    await gateway.login("a@b.com", "x");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://api/api/auth/sign-in/email");
    expect(init.credentials).toBe("include");
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("falha de rede → NetworkError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(gateway.login("a@b.com", "x")).rejects.toBeInstanceOf(NetworkError);
  });

  it("get-session 200 com corpo null → null", async () => {
    mockFetch(200, null);
    await expect(gateway.getSession()).resolves.toBeNull();
  });

  it("get-session 401 → null", async () => {
    mockFetch(401, {});
    await expect(gateway.getSession()).resolves.toBeNull();
  });

  it("get-session 500 → lança (não desloga o usuário)", async () => {
    mockFetch(500, {});
    await expect(gateway.getSession()).rejects.toBeInstanceOf(AuthError);
  });

  it("get-session válida → Session com usuário", async () => {
    mockFetch(200, {
      session: { token: "t", expiresAt: "2030-01-01T00:00:00.000Z" },
      user: { id: "1", email: "a@b.com", name: "Ana", emailVerified: true },
    });
    const session = await gateway.getSession();
    expect(session?.user.name).toBe("Ana");
    expect(session?.user.emailVerified).toBe(true);
    expect(session?.expiresAt.toISOString()).toBe("2030-01-01T00:00:00.000Z");
    expect(session).not.toHaveProperty("token");
  });
});
