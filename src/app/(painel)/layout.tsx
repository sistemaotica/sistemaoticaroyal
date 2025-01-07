import { DM_Sans } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.className}>
      <body className="antialiased">
        <Sidebar />
        <div className="sm:ml-16 sm:mt-3 ml-2 mt-2">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
