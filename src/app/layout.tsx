import type { Metadata, Viewport } from "next";
import { fontHeading, fontBody } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://grantly.app"),
  title: {
    default: "Grantly — Scholarship Discovery & Application Tracker",
    template: "%s | Grantly",
  },
  description:
    "Discover merit and need-based scholarships, calculate your personalized match score, and track your application deadlines locally.",
  keywords: [
    "scholarships",
    "grants",
    "college funding",
    "financial aid",
    "application tracker",
    "student aid",
  ],
  authors: [{ name: "Grantly Team" }],
  creator: "Grantly",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://grantly.app",
    title: "Grantly — Scholarship Discovery & Application Tracker",
    description:
      "Discover merit and need-based scholarships, calculate your personalized match score, and track your application deadlines locally.",
    siteName: "Grantly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grantly — Scholarship Discovery & Application Tracker",
    description:
      "Discover merit and need-based scholarships, calculate your personalized match score, and track your application deadlines locally.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9FA" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontHeading.variable} ${fontBody.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-accent-foreground focus:shadow-md focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollProgress />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
