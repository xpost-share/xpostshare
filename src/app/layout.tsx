import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const inter = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XpostShare - Share Your Success",
  description:
    "Share your success and inspire others with your achievements. Create, read, and engage with stories of success on our blogging platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
