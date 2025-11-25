import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Appifylab - Social Media Feed",
  description: "A social media feed application with posts, comments, and likes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/images/logo-copy.svg" />
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Bootstrap */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        {/* Common Css */}
        <link rel="stylesheet" href="/assets/css/common.css" />
        {/* Custom Css */}
        <link rel="stylesheet" href="/assets/css/main.css" />
        {/* Responsive Css */}
        <link rel="stylesheet" href="/assets/css/responsive.css" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <script src="/assets/js/bootstrap.bundle.min.js" async></script>
      </body>
    </html>
  );
}
