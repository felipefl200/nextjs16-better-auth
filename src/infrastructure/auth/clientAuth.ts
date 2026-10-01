import { GetSessionUseCase } from "@/application/use-cases/GetSessionUseCase";
import { LoginUseCase } from "@/application/use-cases/LoginUseCase";
import { LogoutUseCase } from "@/application/use-cases/LogoutUseCase";
import { RegisterUseCase } from "@/application/use-cases/RegisterUseCase";
import { FetchAuthGateway } from "./FetchAuthGateway";

/** Composição dos casos de uso para componentes client-side. */
const gateway = () => new FetchAuthGateway();

export const makeLoginUseCase = () => new LoginUseCase(gateway());
export const makeRegisterUseCase = () => new RegisterUseCase(gateway());
export const makeLogoutUseCase = () => new LogoutUseCase(gateway());
export const makeGetSessionUseCase = () => new GetSessionUseCase(gateway());
