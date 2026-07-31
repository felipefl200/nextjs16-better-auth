"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { EnableTwoFactorUseCase } from "@/src/application/use-cases/EnableTwoFactorUseCase";
import { VerifyTotpUseCase } from "@/src/application/use-cases/VerifyTotpUseCase";
import { DisableTwoFactorUseCase } from "@/src/application/use-cases/DisableTwoFactorUseCase";

export default function TwoFactorSettingsCard({
  initialTwoFactorEnabled = false,
}: {
  initialTwoFactorEnabled?: boolean;
}) {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
    initialTwoFactorEnabled,
  );
  const [step, setStep] = useState<"idle" | "password" | "totp" | "disable">(
    "idle",
  );
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [totpURI, setTotpURI] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showFullUri, setShowFullUri] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const extractSecret = (uri: string) => {
    try {
      const url = new URL(uri);
      return url.searchParams.get("secret") || "";
    } catch {
      const match = uri.match(/secret=([^&]+)/);
      return match ? match[1] : "";
    }
  };

  const secretKey = extractSecret(totpURI);

  const handleStartSetup = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const gateway = new FetchAuthGateway();
      const enableUseCase = new EnableTwoFactorUseCase(gateway);
      const result = await enableUseCase.execute(password);

      setTotpURI(result.totpURI);
      setBackupCodes(result.backupCodes);
      setStep("totp");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao iniciar configuração do 2FA.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const gateway = new FetchAuthGateway();
      const verifyUseCase = new VerifyTotpUseCase(gateway);
      await verifyUseCase.execute(verificationCode.trim());

      setIsTwoFactorEnabled(true);
      setStep("idle");
      setPassword("");
      setVerificationCode("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Código inválido. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelUnfinishedSetup = async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (password) {
        const gateway = new FetchAuthGateway();
        const disableUseCase = new DisableTwoFactorUseCase(gateway);
        await disableUseCase.execute(password).catch(() => {});
      }
    } finally {
      setIsLoading(false);
      setStep("idle");
      setPassword("");
      setVerificationCode("");
      setTotpURI("");
      setBackupCodes([]);
    }
  };

  const handleDisableTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const gateway = new FetchAuthGateway();
      const disableUseCase = new DisableTwoFactorUseCase(gateway);
      await disableUseCase.execute(password);

      setIsTwoFactorEnabled(false);
      setStep("idle");
      setPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Senha incorreta. Não foi possível desabilitar.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyKey = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-5 bg-gray-950/50 rounded-xl border border-gray-800 flex-wrap gap-4">
      <div>
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-semibold text-white">
            Autenticação em Duas Etapas (2FA)
          </h4>
          {isTwoFactorEnabled ? (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md uppercase tracking-wider">
              Ativado
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-800 text-gray-400 rounded-md uppercase tracking-wider">
              Desativado
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Proteja sua conta utilizando aplicativos de autenticação (Google
          Authenticator, Authy, 1Password).
        </p>
      </div>

      {step === "idle" && (
        <button
          onClick={() => {
            setError(null);
            setPassword("");
            setStep(isTwoFactorEnabled ? "disable" : "password");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            isTwoFactorEnabled
              ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
          }`}
        >
          {isTwoFactorEnabled ? "Desativar 2FA" : "Configurar 2FA"}
        </button>
      )}

      {/* Step 1: Confirmação de Senha para Habilitar */}
      {step === "password" && (
        <div className="w-full mt-4 p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
          <h5 className="text-sm font-semibold text-white">
            Confirme sua senha para habilitar o 2FA
          </h5>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <form
            onSubmit={handleStartSetup}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              required
              className="flex-1 px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isLoading ? "Gerando..." : "Avançar"}
              </button>
              <button
                type="button"
                onClick={() => setStep("idle")}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: QR Code + Chave Secreta Alfanumérica + Verificação TOTP */}
      {step === "totp" && (
        <div className="w-full mt-4 p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <h5 className="text-sm font-semibold text-white">
              1. Escaneie o QR Code ou insira a chave manual
            </h5>
            <button
              type="button"
              onClick={handleCancelUnfinishedSetup}
              disabled={isLoading}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors font-medium"
            >
              Cancelar e Desistir
            </button>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual QR Code Container */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-950 rounded-2xl border border-gray-800">
              <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-indigo-500/20 mb-3">
                <QRCodeSVG
                  value={totpURI}
                  size={180}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[11px] text-gray-400 text-center">
                Abra seu aplicativo (Google Authenticator, Authy, 1Password) e
                escaneie o código acima.
              </p>
            </div>

            {/* Secret Key & Manual String Container */}
            <div className="space-y-4 bg-gray-950 p-5 rounded-2xl border border-gray-800">
              <div>
                <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                  Chave Secreta de Configuração (Secret Key)
                </label>
                <p className="text-[11px] text-gray-400 mb-2">
                  Se não puder escanear o QR Code, insira esta chave manualmente
                  no seu aplicativo:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-black/80 rounded-xl text-xs font-mono text-white tracking-widest break-all border border-gray-800 select-all">
                    {secretKey || totpURI}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopyKey(secretKey || totpURI)}
                    className="px-3 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all shrink-0"
                  >
                    {copiedKey ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Expandable URI details */}
              <div className="pt-2 border-t border-gray-800/60">
                <button
                  type="button"
                  onClick={() => setShowFullUri(!showFullUri)}
                  className="text-[11px] text-gray-500 hover:text-gray-400 font-medium underline"
                >
                  {showFullUri
                    ? "Ocultar URI OTP completa"
                    : "Ver URI OTP completa"}
                </button>
                {showFullUri && (
                  <div className="mt-2 p-3 bg-black/60 rounded-xl text-[10px] font-mono text-gray-400 break-all border border-gray-800 select-all">
                    {totpURI}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Backup Codes Section */}
          {backupCodes.length > 0 && (
            <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-2">
              <h6 className="text-xs font-semibold text-amber-400 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                2. Guarde seus Códigos de Backup em local seguro:
              </h6>
              <p className="text-[11px] text-gray-400">
                Se você perder o acesso ao seu aplicativo autenticador, poderá
                usar um destes códigos de uso único:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {backupCodes.map((code, idx) => (
                  <span
                    key={idx}
                    className="p-2 bg-gray-900 text-center font-mono text-xs text-gray-200 rounded-lg border border-gray-800 select-all"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Enter 6-digit TOTP code */}
          <form
            onSubmit={handleVerifyTotp}
            className="space-y-3 pt-2 bg-gray-950 p-5 rounded-2xl border border-gray-800"
          >
            <label className="block text-xs font-semibold text-white">
              3. Digite o código de 6 dígitos gerado pelo seu aplicativo para
              confirmar a ativação:
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full sm:w-40 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-center font-mono text-base tracking-widest text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verificando..." : "Confirmar e Ativar 2FA"}
              </button>
              <button
                type="button"
                onClick={handleCancelUnfinishedSetup}
                disabled={isLoading}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Desabilitar 2FA */}
      {step === "disable" && (
        <div className="w-full mt-4 p-5 bg-gray-900 border border-red-500/20 rounded-xl space-y-4">
          <h5 className="text-sm font-semibold text-white">
            Desativar Autenticação em Duas Etapas
          </h5>
          <p className="text-xs text-gray-400">
            Digite sua senha para confirmar a desativação do 2FA.
          </p>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <form
            onSubmit={handleDisableTwoFactor}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha atual"
              required
              className="flex-1 px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isLoading ? "Desativando..." : "Confirmar Desativação"}
              </button>
              <button
                type="button"
                onClick={() => setStep("idle")}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
