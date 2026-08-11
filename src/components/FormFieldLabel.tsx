import React from "react";

/** Google Forms–style red asterisk for required fields */
export function RequiredMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-[#D93025] font-bold ml-0.5 ${className}`.trim()}
      aria-hidden="true"
    >
      *
    </span>
  );
}

type FormFieldLabelProps = {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
};

export function FormFieldLabel({
  children,
  required = false,
  htmlFor,
  className = "block text-sm font-semibold text-[#04330B] mb-1.5",
}: FormFieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
      {required ? <RequiredMark /> : null}
    </label>
  );
}
