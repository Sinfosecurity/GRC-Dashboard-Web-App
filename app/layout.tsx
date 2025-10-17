import { ErrorBoundary } from "@/components/ui/error-boundary";
import "./globals.css";

export const metadata = { 
  title: "GRC Atlas", 
  description: "GRC + TPRM Demo",
  keywords: ["GRC", "Risk Management", "Compliance", "Security", "TPRM"],
  authors: [{ name: "GRC Atlas Team" }],
  robots: "index, follow",
  openGraph: {
    title: "GRC Atlas - Enterprise Security Platform",
    description: "Comprehensive Governance, Risk, and Compliance management platform",
    type: "website",
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
