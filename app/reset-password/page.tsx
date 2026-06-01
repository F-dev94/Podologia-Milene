"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/app/lib/supabaseCliente"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionChecking, setSessionChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      // Pequeno delay para garantir que o cliente Supabase processe os parâmetros de hash da URL
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        setHasSession(false)
      } else {
        setHasSession(true)
      }
      setSessionChecking(false)
    }
    
    checkSession()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)
    setError("")

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError("Erro ao redefinir senha: " + error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Realiza o logout após alterar para forçar novo login seguro
      await supabase.auth.signOut()
    }
  }

  if (sessionChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 font-medium">Validando token de segurança...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-[450px] border-none shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif text-primary">Redefinir Senha</CardTitle>
          <CardDescription>Defina sua nova senha de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasSession ? (
            <div className="space-y-4 text-center">
              <div className="p-4 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg flex flex-col items-center gap-3">
                <AlertCircle className="h-10 w-10 text-amber-500 shrink-0" />
                <p className="font-medium text-sm leading-relaxed">
                  Link de recuperação inválido ou expirado. 
                  Por favor, acesse a página de login e solicite um novo e-mail de recuperação de senha.
                </p>
              </div>
              <Button onClick={() => router.push("/login")} className="w-full h-12 text-lg">
                Ir para o Login
              </Button>
            </div>
          ) : success ? (
            <div className="space-y-4 text-center">
              <div className="p-4 text-green-800 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center gap-3">
                <CheckCircle2 className="h-10 w-10 text-green-500 shrink-0" />
                <p className="font-medium text-sm leading-relaxed">
                  Sua senha foi redefinida com sucesso! Você já pode entrar no sistema com a nova credencial.
                </p>
              </div>
              <Button onClick={() => router.push("/login")} className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white">
                Fazer Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100 rounded flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Mínimo 6 caracteres"
                    className="pr-10 h-12"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="Repita a nova senha"
                    className="pr-10 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white mt-4" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "REDEFINIR SENHA"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
