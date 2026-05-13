"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, CalendarDays, Search, Trash2 } from "lucide-react"

interface Agendamento {
  id: number
  nome: string
  telefone: string
  servico: string
  data: string
  horario: string
}

export default function MeusAgendamentos() {
  const [telefone, setTelefone] = useState("")
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(false)
  const [buscou, setBuscou] = useState(false)

  async function buscarAgendamentos(e: React.FormEvent) {
    e.preventDefault()
    const numeroLimpo = telefone.replace(/\D/g, "")
    if (numeroLimpo.length < 10) {
      alert("Por favor, digite um número válido com DDD.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/agendamentos?telefone=${numeroLimpo}`)
      const json = await res.json()
      if (json.sucesso) {
        setAgendamentos(json.dados)
      } else {
        alert("Erro ao buscar agendamentos.")
      }
    } catch (e) {
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
      setBuscou(true)
    }
  }

  async function cancelarAgendamento(id: number, data: string, hora: string, servico: string) {
    if (!confirm(`Tem certeza que deseja cancelar o agendamento de ${servico} no dia ${data.split('-').reverse().join('/')} às ${hora}? A vaga será liberada.`)) {
      return
    }

    try {
      const res = await fetch(`/api/agendamentos?id=${id}`, { method: "DELETE" })
      const json = await res.json()
      
      if (json.sucesso) {
        setAgendamentos(agendamentos.filter(a => a.id !== id))
        alert("✅ Agendamento cancelado com sucesso. A vaga já foi liberada no site.")
      } else {
        alert("Erro ao cancelar: " + json.mensagem)
      }
    } catch {
      alert("Erro de conexão ao tentar cancelar.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-foreground">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="mx-auto max-w-3xl">
          <Card className="border-none shadow-xl mb-8">
            <CardHeader className="bg-primary text-white rounded-t-xl text-center">
              <CardTitle className="text-3xl font-serif">Meus Agendamentos</CardTitle>
              <CardDescription className="text-white/80 mt-2 text-lg">
                Digite seu telefone/WhatsApp para ver e gerenciar seus horários.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={buscarAgendamentos} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <Label className="text-lg font-bold text-slate-800">Seu Celular / WhatsApp</Label>
                  <Input 
                    placeholder="(17) 99999-9999"
                    value={telefone}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, "");
                      if (v.length > 11) v = v.substring(0, 11);
                      if (v.length > 2) v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
                      if (v.length > 10) v = `${v.substring(0, 10)}-${v.substring(10)}`;
                      setTelefone(v);
                    }}
                    required 
                    maxLength={15}
                    className="h-14 text-xl font-medium border-slate-300"
                  />
                </div>
                <Button type="submit" className="h-14 px-8 text-lg font-bold w-full sm:w-auto" disabled={loading}>
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Search className="mr-2" /> Buscar</>}
                </Button>
              </form>
            </CardContent>
          </Card>

          {buscou && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CalendarDays className="text-primary" /> 
                Seus Horários ({agendamentos.length})
              </h3>
              
              {agendamentos.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
                  <p className="text-xl text-slate-500 font-medium">Nenhum agendamento encontrado para este número.</p>
                </div>
              ) : (
                agendamentos.map(a => (
                  <Card key={a.id} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary mb-1">
                          {a.servico}
                        </span>
                        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2">
                          <p className="text-2xl font-black text-slate-800 tracking-tight">{a.horario}</p>
                          <p className="text-lg text-slate-500 font-medium">{new Date(a.data + "T12:00:00").toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        size="lg" 
                        className="w-full sm:w-auto h-12 font-bold"
                        onClick={() => cancelarAgendamento(a.id, a.data, a.horario, a.servico)}
                      >
                        <Trash2 className="mr-2 h-5 w-5" /> Cancelar Horário
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
