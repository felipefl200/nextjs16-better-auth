import { describe, expect, it } from "vitest";
import { buildLoginUrl, sanitizeCallbackUrl } from "./safeRedirect";

describe("sanitizeCallbackUrl", () => {
  it.each(["/dashboard", "/profile?tab=1"])("aceita caminho interno %s", (value) => {
    expect(sanitizeCallbackUrl(value)).toBe(value);
  });

  it.each([undefined, null, "", "//evil.com", "https://evil.com", "/\\evil.com", "dashboard"])(
    "rejeita %s",
    (value) => {
      expect(sanitizeCallbackUrl(value)).toBe("/dashboard");
    },
  );
});

describe("buildLoginUrl", () => {
  it("codifica o callbackUrl", () => {
    expect(buildLoginUrl("/profile?a=1")).toBe("/login?callbackUrl=%2Fprofile%3Fa%3D1");
  });
});
