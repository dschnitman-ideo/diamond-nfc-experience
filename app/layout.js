import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const ui = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Diamond Experience",
  description:
    "NFC-triggered natural diamond product experience — prototype.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${ui.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--surface)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
