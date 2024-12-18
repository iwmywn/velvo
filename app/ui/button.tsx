import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={twMerge(
        "relative z-10 h-9 px-5 text-sm font-medium text-white before:absolute before:left-[50%] before:top-[50%] before:-z-[1] before:h-full before:w-full before:-translate-x-[50%] before:-translate-y-[50%] before:rounded before:border before:bg-black before:transition-all before:duration-300 hover:before:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function FormButton({
  isValid,
  isSubmitting,
  buttonText,
}: {
  isValid: boolean;
  isSubmitting: boolean;
  buttonText: string;
}) {
  return (
    <Button
      disabled={!isValid || isSubmitting}
      className={`${!isValid && "before:opacity-70"} h-10`}
      type="submit"
    >
      {isSubmitting ? (
        <div className="mx-auto h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      ) : (
        buttonText
      )}
    </Button>
  );
}
