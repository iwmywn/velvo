export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="relative z-10 bg-white px-8 pt-8 md:px-20">
        {children}
      </main>
    </>
  );
}
