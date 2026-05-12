// ===================================
// Pagina de Admin - Acessível e Responsiva
// ===================================

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, RefreshCw, ArrowLeft, CalendarDays, Users, DollarSign, MessageCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/app/lib/supabaseCliente"

interface Agendamento {
  id: number
  nome: string
  telefone: string
  email: string
  servico: string
  data: string
  horario: string
  criadoEm: string
}

export default function AdminPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  async function buscarAgendamentos() {
    setCarregando(true)
    setErro("")
    try {
      const res = await fetch("/api/agendamentos", { cache: 'no-store' })
      const dados = await res.json()

      if (dados.sucesso) {
        setAgendamentos(dados.dados)
      } else {
        setErro("Erro ao buscar agendamentos")
      }
    } catch {
      setErro("Erro de conexao com o servidor")
    } finally {
      setCarregando(false)
    }
  }

  async function deletarAgendamento(id: number) {
    if (!confirm("Tem certeza que quer cancelar esse agendamento? Ele será excluído para sempre.")) return

    try {
      const res = await fetch(`/api/agendamentos?id=${id}`, { method: "DELETE" })
      const dados = await res.json()

      if (dados.sucesso) {
        setAgendamentos(agendamentos.filter((a) => a.id !== id))
        alert("Atendimento cancelado com sucesso!")
      } else {
        alert(dados.mensagem || "Erro ao cancelar")
      }
    } catch {
      alert("Erro de conexao")
    }
  }

  useEffect(() => {
    async function verificarAcesso() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/login"
        return
      }
      const adminEmails = ["joaorubens601@gmail.com", "millenepupio@gmail.com"]
      if (!adminEmails.includes(user.email || "")) {
        alert("Acesso negado. Apenas administradores podem acessar esta página.")
        window.location.href = "/" // Redireciona para a página principal (convidado)
        return
      }
      buscarAgendamentos()
    }
    verificarAcesso()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Cabeçalho grande e chamativo */}
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <Link href="/" className="inline-flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-medium">Voltar para o site inicial</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold mt-2">Sua Agenda de Hoje</h1>
          </div>
          
          <div className="flex w-full sm:w-auto gap-3 items-center">
            <Button asChild variant="secondary" size="lg" className="h-14 flex-1 sm:flex-none text-lg font-bold">
              <Link href="/admin/financeiro">
                <DollarSign className="mr-2 h-6 w-6" /> Finanças
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="h-14 flex-1 sm:flex-none text-lg font-bold" onClick={buscarAgendamentos} disabled={carregando}>
              <RefreshCw className={`mr-2 h-6 w-6 ${carregando ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Cartões Grandes de Resumo */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
          <Card className="border-none shadow-lg">
            <CardContent className="flex items-center gap-6 p-8">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                <CalendarDays className="h-10 w-10 text-amber-600" />
              </div>
              <div>
                <p className="text-xl text-muted-foreground font-medium">Total Marcados</p>
                <p className="text-5xl font-extrabold text-foreground">{agendamentos.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-green-50">
            <CardContent className="flex items-center gap-6 p-8">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-200">
                <Users className="h-10 w-10 text-green-700" />
              </div>
              <div>
                <p className="text-xl text-green-800 font-medium">Atendimentos Hoje</p>
                <p className="text-5xl font-extrabold text-green-900">
                  {agendamentos.filter((a) => a.data === new Date().toISOString().split("T")[0]).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {erro && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-100 p-6 text-center text-xl font-bold text-red-700 shadow-sm">
            {erro}
          </div>
        )}

        <Card className="border border-slate-200 shadow-sm mb-10 bg-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-serif flex items-center gap-2 text-slate-800">
              <CalendarDays className="h-6 w-6 text-red-500" />
              Bloquear Horário (Imprevisto)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const d = (document.getElementById('blockDate') as HTMLInputElement).value;
              const t = (document.getElementById('blockTime') as HTMLSelectElement).value;
              if(!d || !t) return alert("Selecione data e hora");
              
              const res = await fetch("/api/agendamentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  nome: "BLOQUEADO (IMPREVISTO)",
                  telefone: "00000000000",
                  email: "admin@bloqueio.com",
                  servico: "Bloqueio de Agenda",
                  data: d,
                  horario: t
                })
              });
              if(res.ok) {
                alert("Horário bloqueado com sucesso!");
                buscarAgendamentos();
              } else {
                alert("Erro ao bloquear");
              }
            }} className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Data a bloquear</label>
                <input id="blockDate" type="date" required className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Horário a bloquear</label>
                <select id="blockTime" required className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
                  <option value="">Selecione</option>
                  <option value="07:00">07:00</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                </select>
              </div>
              <Button type="submit" variant="destructive" size="lg" className="h-12">
                Bloquear Horário
              </Button>
            </form>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-primary" />
          Próximos Clientes
        </h2>

        {carregando ? (
          <div className="py-20 text-center">
            <RefreshCw className="mx-auto h-16 w-16 animate-spin text-primary/50" />
            <p className="mt-6 text-2xl font-medium text-muted-foreground">Buscando sua agenda...</p>
          </div>
        ) : agendamentos.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-300 bg-transparent shadow-none">
            <CardContent className="py-24 text-center">
              <CalendarDays className="mx-auto h-20 w-20 text-slate-300 mb-6" />
              <p className="text-2xl font-bold text-slate-500 mb-2">Sua agenda está livre por enquanto.</p>
              <p className="text-lg text-slate-400">Assim que os clientes marcarem no site, eles aparecerão aqui.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {agendamentos.map((a) => (
              <Card key={a.id} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-2 w-full bg-primary" />
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  
                  {/* Info Cliente */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl font-bold text-foreground leading-none">{a.nome}</h3>
                      <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-base font-bold text-primary">
                        {a.servico}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <p className="text-xl text-slate-600 font-medium flex items-center gap-2">
                        WhatsApp: <span className="font-bold text-foreground">{a.telefone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Data e Hora */}
                  <div className="bg-slate-100 rounded-xl p-4 md:text-right w-full md:w-auto">
                    <p className="text-lg text-slate-500 font-medium mb-1">
                      {new Date(a.data + "T12:00:00").toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-4xl font-black text-slate-800 tracking-tight">
                      {a.horario}
                    </p>
                  </div>

                  {/* Botões de Ação */}
                  <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6 flex flex-col sm:flex-row md:flex-col gap-3">
                    <Button
                      asChild
                      variant="default"
                      size="lg"
                      className="w-full md:w-auto h-14 text-base font-bold bg-green-600 hover:bg-green-700 text-white"
                    >
                      <a 
                        href={`https://wa.me/55${a.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${a.nome}, tudo bem? Aqui é da Podologia Milene. Recebemos seu pedido de agendamento para o dia ${new Date(a.data + "T12:00:00").toLocaleDateString("pt-BR")} às ${a.horario}. Podemos confirmar?`)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" /> Confirmar via WhatsApp
                      </a>
                    </Button>

                    <Button
                      variant="destructive"
                      size="lg"
                      className="w-full md:w-auto h-14 text-base font-bold"
                      onClick={() => deletarAgendamento(a.id)}
                    >
                      <Trash2 className="mr-2 h-5 w-5" /> Cancelar Horário
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
