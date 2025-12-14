"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Sparkles, CheckCircle, XCircle, Loader2 } from "lucide-react"

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token")
      const type = searchParams.get("type")

      if (!token || type !== "email") {
        setStatus("error")
        setMessage("Invalid or missing verification token")
        return
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email"
        })

        if (error) {
          setStatus("error")
          setMessage(error.message || "Verification failed")
        } else {
          setStatus("success")
          setMessage("Email verified successfully!")
          setTimeout(() => router.push("/dashboard"), 2000)
        }
      } catch (err) {
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    verifyEmail()
  }, [searchParams, router, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/20 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md glass-card border-purple-500/20 relative z-10">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            status === "loading" ? "bg-gradient-to-br from-purple-500 to-violet-600" :
            status === "success" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
            "bg-gradient-to-br from-red-500 to-rose-600"
          }`}>
            {status === "loading" && <Loader2 className="w-8 h-8 text-white animate-spin" />}
            {status === "success" && <CheckCircle className="w-8 h-8 text-white" />}
            {status === "error" && <XCircle className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">
            Email Verification
          </CardTitle>
          <CardDescription className="text-gray-400">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Success!"}
            {status === "error" && "Verification Failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4 pt-4">
          <p className="text-gray-400">{message}</p>
          {status === "error" && (
            <div className="space-y-3 pt-2">
              <Button
                onClick={() => router.push("/register")}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/25"
              >
                Register Again
              </Button>
              <Link href="/login" className="block text-purple-400 hover:text-purple-300 text-sm transition-colors">
                Or go to login
              </Link>
            </div>
          )}
          {status === "success" && (
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/20 z-0" />
        <Card className="w-full max-w-md glass-card border-purple-500/20 relative z-10">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold text-gradient">
              Email Verification
            </CardTitle>
            <CardDescription className="text-gray-400">Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
