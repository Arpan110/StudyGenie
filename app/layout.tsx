import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StudyGenie - AI-Powered Study Assistant",
  description:
    "Enhance your productivity with AI-powered features, smart study planning, and instant material summarization.",
  generator: "v0.dev",
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="studygenie-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
