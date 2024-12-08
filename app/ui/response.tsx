import { FaXmark, FaCheck } from "react-icons/fa6";

interface ResponsePageProps {
  title: string;
  message: string;
}

export default function ResponsePage({ title, message }: ResponsePageProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body className="flex items-center justify-center">
        <main>
          <h1>{title}</h1>
          <p>{message}</p>
        </main>
      </body>
    </html>
  );
}
