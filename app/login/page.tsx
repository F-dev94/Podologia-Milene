"use client"

import { useState } from "react"
import { supabase } from "@/app/lib/supabaseCliente"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
      let msgErro = "Credenciais inválidas. Tente novamente."
      if (authError.message.includes("Invalid login credentials")) msgErro = "E-mail ou senha incorretos."
      else if (authError.message.includes("Email not confirmed")) msgErro = "E-mail não confirmado. Verifique sua caixa de entrada."
      else if (authError.message.includes("User not found")) msgErro = "Usuário não encontrado."
      
      setError(msgErro)
      setLoading(false)
      return
    }

    if (data.user) {
      const adminEmails = ["joaorubens601@gmail.com", "millenepupio1@gmail.com"]
      if (adminEmails.includes(data.user.email || "")) {
        router.push("/admin")
      } else {
        router.push("/meus-agendamentos") // Convidados vão para seu painel
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
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
