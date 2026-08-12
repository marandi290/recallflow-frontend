import "./globals.css";
import PWAInstaller from "../components/PWAInstaller";

export const metadata = {
  title: "RecallFlow — Spaced Repetition Study Engine",
  description: "Personalized study revision platform powered by Spaced Repetition algorithms",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RecallFlow",
  },
};

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased custom-scrollbar">
        <PWAInstaller />
        {children}
      </body>
    </html>
  );
}
