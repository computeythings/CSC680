import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased flex flex-col min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
