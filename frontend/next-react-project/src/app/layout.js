import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Panel",
  description: "Custom admin dashboard",
};

function Header() {
  return (
    <header className="bg-slate-500 py-4 ">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">Snowtooth Mountain</Link>
          </div>
          <div>
            <Link href="/mountain">Mountain Info</Link>
          </div>
          <div>
            <Link href="/hotels">Hotels</Link>
          </div> 
        </nav>
      </div>
    </header>  
  )
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900" suppressHydrationWarning>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}


/*
export default function RootLayout({ children }) {
  // Here, place components that you want to render on every page
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
*/