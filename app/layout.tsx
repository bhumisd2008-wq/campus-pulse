import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";

export const metadata: Metadata = {
  title: "Campus Pulse | Your Campus Life, All in One Place",
  description:
    "AI-powered campus information management platform. Manage announcements, events, workshops, examinations and assignment deadlines in one place.",
  keywords: "campus, notices, events, announcements, student portal, AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
