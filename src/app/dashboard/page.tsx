"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, LogOut, ShoppingCart, Package } from "lucide-react"

type Sweet = {
  id: string
  name: string
  description: string
  price: string
  category: string
  image_url: string
  stock: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setUser(profile)
      
      if (profile?.role === 'admin') {
        router.push("/admin")
        return
      }

      const res = await fetch("/api/sweets")
      if (res.ok) {
        const data = await res.json()
        setSweets(data)
      }
      setLoading(false)
    }
    
    init()
  }, [router])

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch("/api/sweets")
    if (res.ok) {
      const data = await res.json()
      setSweets(data)
    }
    setLoading(false)
  }

  async function handlePurchase(sweetId: string) {
    setPurchaseLoading(sweetId)
    
    const res = await fetch(`/api/sweets/${sweetId}/purchase`, {
      method: "POST"
    })

    if (res.ok) {
      alert("Purchase successful!")
      fetchProducts()
    } else {
      const data = await res.json()
      alert(data.error || "Purchase failed")
    }
    
    setPurchaseLoading(null)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const chocolates = sweets.filter(s => s.category === "chocolate")
  const otherSweets = sweets.filter(s => s.category !== "chocolate")

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/20 z-0" />
      
      <nav className="glass-card sticky top-0 z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center group-hover:animate-glow transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Sweet Luxe</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Welcome, <span className="text-purple-400">{user?.full_name || user?.email}</span></span>
            <Button onClick={handleLogout} variant="outline" className="border-purple-500/30 bg-transparent hover:bg-purple-500/10 hover:border-purple-400 text-gray-200">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <ShoppingCart className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Your Personal Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Browse & </span>
            <span className="text-gradient">Purchase</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Explore our premium collection and treat yourself to something special.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center animate-pulse mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400">Loading your treats...</p>
          </div>
        ) : (
          <>
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-transparent rounded-full" />
                <h2 className="text-3xl font-bold text-white">Sweets Collection</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherSweets.map((sweet) => (
                  <Card key={sweet.id} className="glass-card border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="w-full h-40 rounded-xl bg-gradient-to-br from-purple-900/40 to-violet-900/40 flex items-center justify-center mb-4 overflow-hidden">
                        <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-300">{sweet.image_url}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{sweet.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{sweet.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-gradient">${sweet.price}</span>
                        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {sweet.stock}
                        </span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(sweet.id)}
                        disabled={sweet.stock === 0 || purchaseLoading === sweet.id}
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {purchaseLoading === sweet.id ? "Processing..." : sweet.stock === 0 ? "Out of Stock" : "Purchase"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {otherSweets.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <p className="text-gray-400">No sweets available at the moment</p>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-transparent rounded-full" />
                <h2 className="text-3xl font-bold text-white">Chocolate Collection</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chocolates.map((chocolate) => (
                  <Card key={chocolate.id} className="glass-card border-violet-500/10 hover:border-violet-500/30 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="w-full h-40 rounded-xl bg-gradient-to-br from-violet-900/40 to-purple-900/40 flex items-center justify-center mb-4 overflow-hidden">
                        <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-300">{chocolate.image_url}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">{chocolate.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{chocolate.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-gradient">${chocolate.price}</span>
                        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {chocolate.stock}
                        </span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(chocolate.id)}
                        disabled={chocolate.stock === 0 || purchaseLoading === chocolate.id}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {purchaseLoading === chocolate.id ? "Processing..." : chocolate.stock === 0 ? "Out of Stock" : "Purchase"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {chocolates.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <p className="text-gray-400">No chocolates available at the moment</p>
                </div>
              )}
            </section>
          </>
        )}

        <footer className="text-center py-8 mt-16 border-t border-purple-500/10">
          <p className="text-gray-500 text-sm">
            Crafted with passion by <span className="text-purple-400">Priyanshu Chauhan</span>
          </p>
        </footer>
      </main>
    </div>
  )
}
