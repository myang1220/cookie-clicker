import { Pacifico } from "next/font/google";
import "./globals.css";

// Initialize the font
const pacifico = Pacifico({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Cookie Clicker',
  description: 'A simple cookie clicker game',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={pacifico.className}>
      <body>{children}</body>
    </html>
  )
}