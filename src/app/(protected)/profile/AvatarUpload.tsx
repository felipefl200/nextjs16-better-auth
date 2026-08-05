"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserDTO } from "@/src/domain/entities/User";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { UploadAvatarUseCase } from "@/src/application/use-cases/UploadAvatarUseCase";
import { Button, Alert } from "@/src/components/ui";
import Image from "next/image";

interface AvatarUploadProps {
  user: UserDTO;
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("O arquivo excede o limite máximo de 2 MB.");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError("Formato inválido. Selecione uma imagem JPEG, PNG ou WebP.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);
    try {
      const gateway = new FetchAuthGateway();
      const useCase = new UploadAvatarUseCase(gateway);
      await useCase.execute(file);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao enviar avatar.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const currentImage =
    previewUrl ||
    user.avatarUrl ||
    (user.image
      ? user.image.startsWith("http") || user.image.startsWith("blob:")
        ? user.image
        : `/uploads/avatars/${user.image}`
      : null);

  const isBlob = Boolean(currentImage?.startsWith("blob:"));

  return (
    <div className="flex flex-col items-center">
      <div className="relative group mb-4">
        {currentImage ? (
          isBlob ? (
            // blob: não passa pelo otimizador do next/image
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentImage}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover shadow-xl border-2 border-indigo-500/30"
            />
          ) : (
            <Image
              width={96}
              height={96}
              src={currentImage}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover shadow-xl border-2 border-indigo-500/30"
            />
          )
        ) : (
          <div className="w-24 h-24 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/20 border-2 border-indigo-400/30">
            {getInitials(user.name || "User")}
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold">
            Enviando...
          </div>
        )}
      </div>

      {error && (
        <Alert variant="danger" className="w-full mb-3 text-xs py-2 px-3">
          {error}
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        isLoading={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {user.image ? "Alterar Avatar" : "Enviar Avatar"}
      </Button>
      <span className="text-[11px] text-gray-500 mt-2">
        Formatos: JPG, PNG ou WebP (Máx. 2 MB)
      </span>
    </div>
  );
}
