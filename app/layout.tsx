import type { Metadata, Viewport } from "next";
import { Nunito, Space_Mono } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ČESKY — Чеська для слов'ян",
  description:
    "Вивчай чеську легко! Додаток для українців та росіян з AI-чатом, граматикою та вправами.",
  keywords: ["czech", "language", "learning", "Ukrainian", "Russian", "Slavic"],
  authors: [{ name: "ČESKY App" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "ČESKY — Чеська для слов'ян",
    description: "Вивчай чеську легко з AI-помічником",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f0" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        {/* Inline script to prevent flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('cesky-app-store');
                  if (stored) {
                    var state = JSON.parse(stored);
                    var dark = state.state?.dark !== false;
                    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${nunito.variable} ${spaceMono.variable}`}>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
