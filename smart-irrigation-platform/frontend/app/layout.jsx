import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata = {
  title: "Smart Farming Hub | Grow with clarity",
  description: "A unified operating system for connected, resilient farms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
