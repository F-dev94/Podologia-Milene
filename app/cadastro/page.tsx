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

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Primeiro cria o Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: nome
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Salva na tabela interna de pacientes
    if (authData.user) {
      const { error: dbError } = await supabase.from('pacientes').upsert({
        name: nome,
        email: email,
        phone: "" // opcional no início
      }, { onConflict: 'email' })

      if (dbError) {
         console.warn("Erro ao sincronizar paciente:", dbError)
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-[450px] border-none shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif text-primary">Cadastro</CardTitle>
          <CardDescription>Crie sua conta no nosso espaço</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 text-green-700 bg-green-100 rounded-lg">
                Cadastro realizado com sucesso! Você já pode agendar seus horários.
              </div>
              <Button onClick={() => router.push("/")} className="w-full">Voltar ao Início</Button>
            </div>
          ) : (
            <form onSubmit={handleCadastro} className="space-y-4">
              {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded">{error}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input 
                  id="nome" 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                />
              </div>

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
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength={6}
                />
              </div>
              
              <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "CRIAR CONTA"}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                Já possui uma conta? <Link href="/login" className="text-primary font-medium hover:underline">Faça login</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
