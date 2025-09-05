import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScrollInitializer from "@/components/SmoothScrollInitializer";
import ScrollToTop from "@/components/ScrollToTop";
import Providers from "@/components/Providers";

export const metadata = {
  title: "KINIR...anything tribal",
  description: "Celebrating Jharkhand's rich tribal heritage through fashi",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kingthings+Linear+K&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-tribal smooth-scroll-force">
        <Providers>
          {/* ✅ Smooth Scrolling Initializer */}
          <SmoothScrollInitializer />
          
          {/* ✅ Navbar */}
          <Navbar />

          {/* ✅ Page Content */}
          <main className="flex-1">{children}</main>

          {/* ✅ Footer */}
          <footer className="bg-tribal-red text-white py-8 text-center mt-10">
            <div className="max-w-6xl mx-auto px-4">
              <p className="text-base sm:text-lg mb-4">
                © {new Date().getFullYear()} KINIR. All rights reserved.
              </p>
              <p className="text-sm sm:text-base opacity-75">
                Celebrating the rich tribal heritage of Jharkhand through
                authentic handcrafted fashion
              </p>
            </div>
          </footer>

          {/* ✅ Scroll to Top Button */}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}