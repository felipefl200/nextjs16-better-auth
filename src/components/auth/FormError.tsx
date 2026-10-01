type FormErrorProps = { id: string; message: string | null };

export default function FormError({ id, message }: FormErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className={message ? "mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm" : "sr-only"}
    >
      {message}
    </p>
  );
}
