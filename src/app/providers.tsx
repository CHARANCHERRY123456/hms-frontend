'use client'
import { SessionProvider } from "next-auth/react"
import { AuthProvider as CustomAuthProvider } from "@/contexts/AuthContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CustomAuthProvider>
        {children}
      </CustomAuthProvider>
    </SessionProvider>
  )
}
