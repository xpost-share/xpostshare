// src/app/layout.tsx
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";
import {nuale, poppins} from './ui/Font'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nuale.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
