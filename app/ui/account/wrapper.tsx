import { ReactNode } from "react";

interface WrapperProps {
  title: string;
  children: ReactNode;
}

export default function Wrapper({ title, children }: WrapperProps) {
  return (
    <div className="flex min-h-screen justify-center">
      <div className="flex w-full max-w-[30rem] flex-col items-center pt-5 text-sm">
        <h1 className="mb-7 text-2xl font-semibold">{title}</h1>
        {children}
      </div>
    </div>
  );
}
