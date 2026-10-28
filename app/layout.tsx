import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kotlin/Up · Android Senior Roadmap",
  description: "Tu ruta interactiva para convertirte en desarrollador Android freelance.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
