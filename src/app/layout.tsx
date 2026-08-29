import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WelcomeModeModal } from "@/components/welcome-mode-modal";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "NoviVet - Veterinary Clinical Cloud Platform",
  description: "Designed and product-directed by Jerome Gotangco. Developed with Google Antigravity / Gemini.",
  authors: [
    { name: "Jerome Gotangco", url: "https://github.com/jgotangco" },
    { name: "Google Antigravity / Gemini" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className={`${inter.variable} font-sans min-h-full flex flex-col text-slate-900 selection:bg-emerald-500 selection:text-white`}>
        <ThemeProvider>
          <WelcomeModeModal />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
