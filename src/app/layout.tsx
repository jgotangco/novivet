import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WelcomeModeModal } from "@/components/welcome-mode-modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoviVet — Cloud-Native Veterinary Clinical Operating System",
  description: "Enterprise multi-persona veterinary clinical operating system for small animal hospitals (canine & feline).",
  authors: [{ name: "Jerome Gotangco", url: "https://github.com/jgotangco" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <WelcomeModeModal />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
