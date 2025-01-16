export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen justify-center">
      <div className="flex w-full max-w-[30rem] flex-col items-center pt-5 text-sm">
        {children}
      </div>
    </div>
  );
}
