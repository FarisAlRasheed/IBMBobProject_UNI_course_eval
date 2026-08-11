import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "University Course Evaluation System",
  description:
    "Submit and review course evaluations for university courses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-gray-400">
            University Course Evaluation System &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}
