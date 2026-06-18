import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logic Pro Academy",
  description: "Learn Logic Pro by building an emotional electronic track."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
