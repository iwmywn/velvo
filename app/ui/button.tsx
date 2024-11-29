interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`h-9 rounded bg-black px-5 text-sm font-medium text-white transition-all duration-300 hover:scale-95 ${className} `}
    >
      {children}
    </button>
  );
}
