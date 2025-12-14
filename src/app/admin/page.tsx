"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Sparkles, LogOut, Plus, Pencil, Trash2, Shield, Mail, Lock, Upload } from "lucide-react"

type Sweet = {
  id: string
  name: string
  description: string
  price: string
  category: string
  image_url: string
  stock: number
}

export default function AdminPage() {
  const [products, setProducts] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Sweet | null>(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "candy",
    image_url: "",
    stock: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      setIsAdmin(true)
      fetchProducts()
    } else {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (error) {
      setLoginError(error.message)
      setLoginLoading(false)
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'admin') {
        setIsAdmin(true)
        setLoginLoading(false)
        fetchProducts()
      } else {
        setLoginError("You do not have admin privileges")
        await supabase.auth.signOut()
        setLoginLoading(false)
      }
    }
  }

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch("/api/admin/products")
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null

    setUploading(true)
    const supabase = createClient()
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      setUploading(false)
      return null
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    setUploading(false)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    let imageUrl = formData.image_url

    if (imageFile) {
      const uploadedUrl = await uploadImage()
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        alert("Failed to upload image")
        return
      }
    }

    const dataToSubmit = { ...formData, image_url: imageUrl }
    
    if (editingProduct) {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit)
      })
      
      if (res.ok) {
        fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
        resetForm()
      }
    } else {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit)
      })
      
      if (res.ok) {
        fetchProducts()
        setShowForm(false)
        resetForm()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE"
    })
    
    if (res.ok) {
      fetchProducts()
    }
  }

  function handleEdit(product: Sweet) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      stock: product.stock
    })
    setImagePreview(product.image_url)
    setImageFile(null)
    setShowForm(true)
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "candy",
      image_url: "",
      stock: 0
    })
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsAdmin(false)
    setProducts([])
    setLoginEmail("")
    setLoginPassword("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/20 z-0" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center animate-pulse mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/20 z-0" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        
        <Card className="w-full max-w-md glass-card border-purple-500/20 relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gradient">
              Admin Portal
            </CardTitle>
            <p className="text-gray-400 text-sm">Enter your admin credentials</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="pl-10 bg-black/50 border-purple-500/20 focus:border-purple-500/50 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="pl-10 bg-black/50 border-purple-500/20 focus:border-purple-500/50 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}
              <Button 
                type="submit" 
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/25"
              >
                {loginLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center pt-4 border-t border-purple-500/10">
                <p className="text-sm text-gray-500 mb-3">Need an admin account?</p>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/setup")}
                  className="border-purple-500/30 bg-transparent hover:bg-purple-500/10 text-gray-300"
                >
                  Create Admin Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/20 z-0" />
      
      <nav className="glass-card sticky top-0 z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Admin Dashboard</span>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-purple-500/30 bg-transparent hover:bg-purple-500/10 hover:border-purple-400 text-gray-200">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-transparent rounded-full" />
            <h2 className="text-3xl font-bold text-white">Product Management</h2>
          </div>
          <Button 
            onClick={() => {
              setShowForm(!showForm)
              setEditingProduct(null)
              resetForm()
            }}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/25"
          >
            {showForm ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Product</>}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 glass-card border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-black/50 border-purple-500/20 focus:border-purple-500/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-300">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-black/50 border border-purple-500/20 rounded-lg px-3 py-2 text-white focus:border-purple-500/50"
                    >
                      <option value="candy">Candy</option>
                      <option value="chocolate">Chocolate</option>
                      <option value="cake">Cake</option>
                      <option value="cupcake">Cupcake</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="bg-black/50 border-purple-500/20 focus:border-purple-500/50 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-gray-300">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="bg-black/50 border-purple-500/20 focus:border-purple-500/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-gray-300">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock.toString()}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      required
                      className="bg-black/50 border-purple-500/20 focus:border-purple-500/50 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-gray-300">Product Image</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-black/50 border border-purple-500/20 border-dashed rounded-lg hover:border-purple-500/40 transition-colors">
                        <Upload className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400 text-sm">Choose file or drag here</span>
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative w-48 h-48 border border-purple-500/20 rounded-xl overflow-hidden">
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/25"
                >
                  {uploading ? "Uploading..." : editingProduct ? "Update Product" : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center animate-pulse mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="glass-card border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="relative w-full h-48 mb-4 bg-gradient-to-br from-purple-900/40 to-violet-900/40 rounded-xl overflow-hidden flex items-center justify-center">
                    {product.image_url && !product.image_url.match(/[\u{1F300}-\u{1F9FF}]/u) ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-6xl opacity-60">{product.image_url || ""}</div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                  <p className="text-xs text-gray-500 mb-4 bg-gray-800/50 inline-block px-2 py-1 rounded-full">{product.category}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gradient">${product.price}</span>
                    <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(product)}
                      variant="outline"
                      className="flex-1 border-purple-500/30 bg-transparent hover:bg-purple-500/10 text-gray-300"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      variant="destructive"
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <footer className="text-center py-8 mt-16 border-t border-purple-500/10">
          <p className="text-gray-500 text-sm">
            Admin Panel - <span className="text-purple-400">Priyanshu Chauhan</span>
          </p>
        </footer>
      </main>
    </div>
  )
}
