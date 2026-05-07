/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
// @ts-expect-error
import "./globals.css";

import AosInit from "@/components/AosInit";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Foodbank",
  description: "Making Life Easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-sans antialiased">
        <AosInit />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
