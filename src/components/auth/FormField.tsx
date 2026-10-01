import { useId, type InputHTMLAttributes } from "react";

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  label: string;
  name: string;
  hint?: string;
  accent: "indigo" | "purple";
};

const rings = {
  indigo: "focus:ring-indigo-500",
  purple: "focus:ring-purple-500",
};

export default function FormField({ label, hint, accent, ...inputProps }: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <p className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? hintId : undefined}
        className={`w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 ${rings[accent]} transition-all outline-none placeholder-gray-500 text-white`}
        {...inputProps}
      />
      {hint && (
        <small id={hintId} className="mt-1 text-xs text-gray-500">
          {hint}
        </small>
      )}
    </p>
  );
}
