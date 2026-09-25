// Form building blocks for the admin editors, matching the project editor's
// styling. Plain inputs with defaultValue, so they work in Server and Client
// Components.

import Link from "next/link";

export const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none transition focus:border-cyan-400/60";

type BaseProps = {
  name: string;
  label: string;
  defaultValue: string;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
};

function Messages({ name, error, hint }: Pick<BaseProps, "name" | "error" | "hint">) {
  return (
    <>
      {hint && (
        <p id={`${name}-hint`} className="mt-2 text-sm text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </>
  );
}

function describedBy({ name, error, hint }: Pick<BaseProps, "name" | "error" | "hint">) {
  return error ? `${name}-error` : hint ? `${name}-hint` : undefined;
}

export function TextField({
  type = "text",
  placeholder,
  ...props
}: BaseProps & { type?: "text" | "url" | "email" | "date" | "number"; placeholder?: string }) {
  const { name, label, defaultValue, error, required, maxLength } = props;
  return (
    <div>
      <label htmlFor={name} className="text-sm text-slate-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={type === "number" || type === "date" ? undefined : maxLength}
        min={type === "number" ? 0 : undefined}
        max={type === "number" ? 9999 : undefined}
        step={type === "number" ? 1 : undefined}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        aria-describedby={describedBy(props)}
        className={inputClass}
      />
      <Messages {...props} />
    </div>
  );
}

export function TextArea({ rows = 5, ...props }: BaseProps & { rows?: number }) {
  const { name, label, defaultValue, error, required, maxLength } = props;
  return (
    <div>
      <label htmlFor={name} className="text-sm text-slate-300">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        aria-describedby={describedBy(props)}
        className={inputClass}
      />
      <Messages {...props} />
    </div>
  );
}

export function SelectField({
  options,
  ...props
}: BaseProps & { options: { value: string; label: string }[] }) {
  const { name, label, defaultValue, error } = props;
  return (
    <div>
      <label htmlFor={name} className="text-sm text-slate-300">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        aria-describedby={describedBy(props)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Messages {...props} />
    </div>
  );
}

export function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-slate-300">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-5 w-5 accent-cyan-400"
      />
      {label}
    </label>
  );
}

export function FormFooter({
  error,
  pending,
  cancelHref,
}: {
  error: string | null;
  pending: boolean;
  cancelHref: string;
}) {
  return (
    <>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-[#07111f] transition disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <Link
          href={cancelHref}
          className="rounded-full border border-white/10 px-6 py-3 text-slate-300 transition hover:border-cyan-400/40"
        >
          Cancel
        </Link>
      </div>
    </>
  );
}
