import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

/*
 * One family, two widths. Archivo is a variable grotesque with a `wdth` axis,
 * so display type is the same face stretched to 125% rather than a second
 * typeface — width carries the hierarchy, which is how signage does it.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TeamUp",
  description: "A simple, free, open-source alternative to Jira.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
