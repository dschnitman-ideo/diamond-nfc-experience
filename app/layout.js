import localFont from "next/font/local";
import "./globals.css";

// GT Canon (Grilli Type) — display serif, headlines and diamond names.
const display = localFont({
  src: [
    { path: "../fonts/GTCanon-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/GTCanon-Regular.otf", weight: "400", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

// GT Standard (Grilli Type) — UI sans, everything but headlines/names.
// Same files as the diamonds-education-microsite sibling project.
const ui = localFont({
  src: [
    { path: "../fonts/GTStandard-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/GTStandard-Medium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-ui",
  display: "swap",
});

export const metadata = {
  title: "Diamond Experience",
  description:
    "NFC-triggered natural diamond product experience: prototype.",
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
