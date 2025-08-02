import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ClientApolloProvider from "@/components/ClientApolloProvider"
// import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Multi-Business Dashboard",
  description: "Comprehensive dashboard for hotel, restaurant, and salon management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientApolloProvider>{children}</ClientApolloProvider>
      </body>
    </html>
  )
}
