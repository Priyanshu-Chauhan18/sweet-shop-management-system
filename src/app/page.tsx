"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ShoppingBag, Star } from "lucide-react"

type Sweet = {
  id: string
  name: string
  description: string
  price: string
  category: string
  image_url: string
  stock: number
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 20,
      size: 4 + Math.random() * 8,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-purple-500/20 animate-float-up"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            bottom: '-20px',
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [chocolates, setChocolates] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/sweets")
        const data = await res.json()
        
        setSweets(data.filter((s: Sweet) => s.category !== "chocolate"))
        setChocolates(data.filter((s: Sweet) => s.category === "chocolate"))
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <FloatingParticles />
      
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/20 z-0" />
      
      <nav className="glass-card sticky top-0 z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center group-hover:animate-glow transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Sweet Luxe</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-purple-500/30 bg-transparent hover:bg-purple-500/10 hover:border-purple-400 text-gray-200">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/25">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Premium Confections</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Indulge in </span>
            <span className="text-gradient">Luxury</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover our exquisite collection of handcrafted sweets and artisan chocolates, 
            curated for the most discerning palates.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center animate-pulse mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400">Loading premium treats...</p>
          </div>
        ) : (
          <>
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-transparent rounded-full" />
                <h2 className="text-3xl font-bold text-white">Sweets Collection</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sweets.map((sweet) => (
                  <Card key={sweet.id} className="glass-card border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative w-full h-52 bg-gradient-to-br from-purple-900/40 to-violet-900/40 overflow-hidden">
                        {sweet.image_url && !sweet.image_url.match(/[\u{1F300}-\u{1F9FF}]/u) ? (
                          <Image 
                            src={sweet.image_url} 
                            alt={sweet.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-60">
                            {sweet.image_url || ""}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{sweet.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{sweet.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gradient">${sweet.price}</span>
                          <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">{sweet.stock} in stock</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {sweets.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <p className="text-gray-400">No sweets available at the moment</p>
                </div>
              )}
            </section>

            <section className="mb-20">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-transparent rounded-full" />
                <h2 className="text-3xl font-bold text-white">Chocolate Collection</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chocolates.map((chocolate) => (
                  <Card key={chocolate.id} className="glass-card border-violet-500/10 hover:border-violet-500/30 transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative w-full h-52 bg-gradient-to-br from-violet-900/40 to-purple-900/40 overflow-hidden">
                        {chocolate.image_url && !chocolate.image_url.match(/[\u{1F300}-\u{1F9FF}]/u) ? (
                          <Image 
                            src={chocolate.image_url} 
                            alt={chocolate.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-60">
                            {chocolate.image_url || ""}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">{chocolate.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{chocolate.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gradient">${chocolate.price}</span>
                          <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">{chocolate.stock} in stock</span>
                        </div>
                      </div>
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

        <div className="text-center py-16">
          <div className="glass-card rounded-3xl p-12 max-w-2xl mx-auto neon-border">
            <ShoppingBag className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Luxury?</h3>
            <p className="text-gray-400 mb-8">Create your account and start exploring our premium collection today.</p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-8 shadow-lg shadow-purple-500/25">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        <footer className="text-center py-8 border-t border-purple-500/10">
          <p className="text-gray-500 text-sm">
            Crafted with passion by <span className="text-purple-400">Priyanshu Chauhan</span>
          </p>
        </footer>
      </main>
    </div>
  )
}
