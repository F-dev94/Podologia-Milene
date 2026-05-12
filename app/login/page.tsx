"use client"

import { useState } from "react"
import { supabase } from "@/app/lib/supabaseCliente"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Credenciais inválidas. Tente novamente.")
      setLoading(false)
      return
    }

    if (data.user) {
      const adminEmails = ["joaorubens601@gmail.com", "millenepupio@gmail.com"]
      if (adminEmails.includes(data.user.email || "")) {
        router.push("/admin")
      } else {
        router.push("/") // Convidados vão para a home
      }
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError("Digite seu e-mail primeiro para recuperar a senha.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    })
    if (error) {
      setError("Erro ao enviar e-mail de recuperação: " + error.message)
    } else {
      alert("Se houver uma conta com este e-mail, enviaremos um link para redefinir a senha.")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-[400px] border-none shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif text-primary">Login</CardTitle>
          <CardDescription>Acesse o painel do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button type="button" onClick={handleResetPassword} className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "ENTRAR"}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Não possui uma conta? <Link href="/cadastro" className="text-primary font-medium hover:underline">Cadastre-se</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
