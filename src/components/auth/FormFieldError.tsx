interface FormFieldErrorProps {
  message?: string;
}

export default function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) return null;

  return (
    <p className="text-xs text-destructive font-sans mt-1.5" role="alert">
      {message}
    </p>
  );
}
