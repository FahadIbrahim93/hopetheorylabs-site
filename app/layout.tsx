import type { Metadata } from "next";
import "./globals.css";

// Fonts, brand tokens and full metadata are added in the "Step 1 - Setup" issue.
export const metadata: Metadata = {
  title: "Hope Theory Labs",
  description: "Fast websites for Bangladeshi businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
