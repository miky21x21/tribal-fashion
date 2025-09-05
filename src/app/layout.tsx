import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScrollInitializer from "@/components/SmoothScrollInitializer";
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
        <link rel="preload" href="/fonts/Kingthings Linear K.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/MTCORSVA.TTF" as="font" type="font/ttf" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Kingthings Linear K';
              src: url('/fonts/Kingthings Linear K.ttf') format('truetype');
              font-display: block;
              font-weight: 400;
            }
            @font-face {
              font-family: 'Monotype Corsiva';
              src: url('/fonts/MTCORSVA.TTF') format('truetype');
              font-display: block;
              font-weight: 400;
            }
            .font-kiner, .kinir-logo, h1, .kinir-logo h1 {
              font-family: 'Kingthings Linear K', serif !important;
              font-display: block !important;
              font-weight: 400 !important;
            }
            .subtitle {
              font-family: 'Monotype Corsiva', cursive !important;
              font-display: block !important;
              font-weight: 400 !important;
            }
          `
        }} />
      </head>
      <body className="min-h-screen font-tribal smooth-scroll-force">
        <Providers>
          {/* ✅ Smooth Scrolling Initializer */}
          <SmoothScrollInitializer />
          
          {/* ✅ Navbar */}
          <Navbar />

          {/* ✅ Page Content */}
          <main>{children}</main>

          {/* ✅ Footer */}
          <footer className="bg-[#7f0f07] text-white py-8 text-center mt-10">
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

        </Providers>
      </body>
    </html>
  );
}