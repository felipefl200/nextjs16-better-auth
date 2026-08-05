import { AuthGateway } from "../ports/AuthGateway";

export class UploadAvatarUseCase {
  constructor(private authGateway: AuthGateway) {}

  async execute(file: File): Promise<{ filename: string; avatarUrl: string }> {
    if (!file) {
      throw new Error("Selecione um arquivo de imagem.");
    }

    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      throw new Error("O arquivo deve ter no máximo 2 MB.");
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      throw new Error("Formato inválido. Use JPEG, PNG ou WebP.");
    }

    // 1. Upload do arquivo para a infraestrutura (o backend já vincula e persiste a imagem no perfil do usuário)
    const { filename } = await this.authGateway.uploadAvatar(file);

    const avatarUrl = `/uploads/avatars/${filename}`;
    return { filename, avatarUrl };
  }
}
