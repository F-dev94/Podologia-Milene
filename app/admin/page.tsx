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
  const [canceladosParaAvisar, setCanceladosParaAvisar] = useState<Agendamento[]>([])
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [carregandoFeedbacks, setCarregandoFeedbacks] = useState(false)

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
    const agendamento = agendamentos.find(a => a.id === id);
    if (!confirm("Tem certeza que quer cancelar esse agendamento? Ele será excluído para sempre.")) return

    try {
      const res = await fetch(`/api/agendamentos?id=${id}`, { method: "DELETE" })
      const dados = await res.json()

      if (dados.sucesso) {
        setAgendamentos(agendamentos.filter((a) => a.id !== id))
        
        if (agendamento && agendamento.telefone) {
          const dataFormatada = agendamento.data.split('-').reverse().join('/');
          const mensagem = `Olá, ${agendamento.nome}!\nInfelizmente tivemos um imprevisto e precisamos *CANCELAR* o seu agendamento de ${agendamento.servico} do dia ${dataFormatada} às ${agendamento.horario}.\n\nPor favor, entre em contato para remarcarmos!`;
          const numeroLimpo = agendamento.telefone.replace(/\D/g, "");
          const urlWhatsapp = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
          
          if (confirm("Agendamento cancelado! Deseja enviar uma mensagem avisando o cliente no WhatsApp agora?")) {
            window.open(urlWhatsapp, '_blank');
          }
        } else {
          alert("Atendimento cancelado com sucesso!");
        }
      } else {
        alert(dados.mensagem || "Erro ao cancelar")
      }
    } catch {
      alert("Erro de conexao")
    }
  }

  async function cancelarDiaTodo(data: string) {
    if (!data) return alert("Selecione uma data para cancelar.")
    if (!confirm(`Tem certeza ABSOLUTA que deseja cancelar TODOS os agendamentos do dia ${data.split('-').reverse().join('/')}?`)) return
    
    const afetados = agendamentos.filter(a => a.data === data)
    if (afetados.length === 0) return alert("Não há agendamentos nesta data.")

    try {
      setCarregando(true)
      for (const ag of afetados) {
        await fetch(`/api/agendamentos?id=${ag.id}`, { method: "DELETE" })
      }
      
      setAgendamentos(agendamentos.filter(a => a.data !== data))
      setCanceladosParaAvisar(afetados)
      alert("Dia cancelado! Veja a lista de clientes para avisar que apareceu na tela.")
    } catch {
      alert("Erro ao tentar cancelar o dia.")
    } finally {
      setCarregando(false)
    }
  }

  function gerarResumoDoDia() {
    const hoje = new Date().toISOString().split("T")[0]
    const agendamentosHoje = agendamentos.filter(a => a.data === hoje)
    
    if (agendamentosHoje.length === 0) {
      return alert("Nenhum agendamento para hoje.")
    }

    let msg = `📅 *RESUMO DO DIA - ${new Date().toLocaleDateString("pt-BR")}*\n\n`
    agendamentosHoje.forEach(a => {
      msg += `⏰ *${a.horario}* - ${a.nome}\n👣 ${a.servico}\n📱 ${a.telefone}\n\n`
    })
    
    const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(urlWhatsapp, '_blank')
  }

  async function buscarFeedbacks() {
    setCarregandoFeedbacks(true)
    try {
      const res = await fetch("/api/feedbacks")
      const json = await res.json()
      if (json.sucesso) setFeedbacks(json.dados || [])
    } catch (e) {
      console.error(e)
    } finally {
      setCarregandoFeedbacks(false)
    }
  }

  async function alternarAprovacaoFeedback(id: number, approved: boolean) {
    try {
      const res = await fetch("/api/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved })
      })
      if (res.ok) buscarFeedbacks()
    } catch (e) {
      alert("Erro ao atualizar feedback")
    }
  }

  async function deletarFeedback(id: number) {
    if (!confirm("Deletar este feedback permanentemente?")) return
    try {
      const res = await fetch(`/api/feedbacks?id=${id}`, { method: "DELETE" })
      if (res.ok) buscarFeedbacks()
    } catch (e) {
      alert("Erro ao deletar feedback")
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
      buscarFeedbacks()
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
            <CardContent className="flex items-center justify-between gap-6 p-8">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                  <CalendarDays className="h-10 w-10 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl text-muted-foreground font-medium">Total Marcados</p>
                  <p className="text-5xl font-extrabold text-foreground">{agendamentos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-green-50">
            <CardContent className="flex items-center justify-between gap-6 p-8">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-200">
                  <Users className="h-10 w-10 text-green-700" />
                </div>
                <div>
                  <p className="text-xl text-green-800 font-medium">Atendimentos Hoje</p>
                  <p className="text-5xl font-extrabold text-green-900">
                    {agendamentos.filter((a) => a.data === new Date().toISOString().split("T")[0]).length}
                  </p>
                </div>
              </div>
              <Button onClick={gerarResumoDoDia} className="bg-green-600 hover:bg-green-700 text-white font-bold h-12">
                <MessageCircle className="mr-2 h-5 w-5" /> Enviar Resumo
              </Button>
            </CardContent>
          </Card>
        </div>

        {erro && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-100 p-6 text-center text-xl font-bold text-red-700 shadow-sm">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="border border-slate-200 shadow-sm bg-slate-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-serif flex items-center gap-2 text-slate-800">
                <CalendarDays className="h-6 w-6 text-red-500" />
                Bloquear Horário Único
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
              }} className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-bold text-slate-700">Data</label>
                    <input id="blockDate" type="date" required className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-bold text-slate-700">Horário</label>
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
                </div>
                <Button type="submit" variant="destructive" size="lg" className="h-12 w-full">
                  Bloquear Horário
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-red-200 shadow-sm bg-red-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-serif flex items-center gap-2 text-red-700">
                <Trash2 className="h-6 w-6" />
                Cancelar Dia Inteiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={e => {
                e.preventDefault();
                const d = (document.getElementById('cancelAllDate') as HTMLInputElement).value;
                cancelarDiaTodo(d);
              }} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-red-900">Data a cancelar</label>
                  <input id="cancelAllDate" type="date" required className="flex h-12 w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm" />
                </div>
                <Button type="submit" variant="destructive" size="lg" className="h-12 w-full mt-auto">
                  Excluir Tudo Desse Dia
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {canceladosParaAvisar.length > 0 && (
          <Card className="border-2 border-red-500 shadow-xl mb-10 bg-white overflow-hidden">
            <div className="bg-red-500 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="h-6 w-6" /> Avisar Clientes Cancelados
              </h3>
              <p className="text-red-100 mt-1">Clique nos botões abaixo para enviar mensagem no WhatsApp avisando sobre o cancelamento do dia.</p>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {canceladosParaAvisar.map(a => (
                  <div key={a.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{a.nome} <span className="text-slate-500 font-normal text-sm">({a.horario})</span></p>
                      <p className="text-slate-600">{a.telefone}</p>
                    </div>
                    <Button asChild variant="default" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto mt-4 sm:mt-0">
                      <a 
                        href={`https://wa.me/55${a.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá, ${a.nome}!\nInfelizmente tivemos um imprevisto e precisamos *CANCELAR* o seu agendamento de ${a.servico} que estava marcado para o dia ${a.data.split('-').reverse().join('/')} às ${a.horario}.\n\nPedimos desculpas pelo transtorno. Por favor, entre em contato para remarcarmos!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" /> Avisar {a.nome}
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6 h-12"
                onClick={() => setCanceladosParaAvisar([])}
              >
                Ocultar esta lista
              </Button>
            </CardContent>
          </Card>
        )}

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
                        href={`https://wa.me/55${a.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá, ${a.nome}! Tudo bem?\n\nAqui é da Clínica *Podologia Milene*. Estou entrando em contato para *CONFIRMAR* seu agendamento:\n\n👣 Serviço: ${a.servico}\n📅 Data: ${new Date(a.data + "T12:00:00").toLocaleDateString("pt-BR")}\n⏰ Hora: ${a.horario}\n\nPodemos confirmar sua presença?`)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full"
                      >
                        <MessageCircle className="mr-2 h-6 w-6" /> <span className="text-lg">Confirmar via WhatsApp</span>
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
        )}

        <hr className="my-16 border-slate-200" />

        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-amber-500" />
          Gerenciar Avaliações de Clientes
        </h2>

        <div className="grid gap-6 mb-20">
          {carregandoFeedbacks ? (
             <div className="text-center p-10"><RefreshCw className="animate-spin inline mr-2" /> Carregando avaliações...</div>
          ) : feedbacks.length === 0 ? (
            <p className="text-slate-500 text-lg">Nenhuma avaliação recebida ainda.</p>
          ) : (
            feedbacks.map(f => (
              <Card key={f.id} className={`border-none shadow-sm ${f.approved ? 'bg-white' : 'bg-amber-50 border-2 border-amber-200'}`}>
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="font-bold text-slate-900">{f.pacientes?.name || "Cliente"}</span>
                       <div className="flex text-amber-400">
                          {Array.from({length: f.rating}).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                       </div>
                    </div>
                    <p className="text-slate-700 italic">"{f.comment}"</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={f.approved ? "outline" : "default"} 
                      className={f.approved ? "" : "bg-amber-600 hover:bg-amber-700"}
                      onClick={() => alternarAprovacaoFeedback(f.id, !f.approved)}
                    >
                      {f.approved ? "Ocultar do Site" : "Aprovar para o Site"}
                    </Button>
                    <Button variant="destructive" onClick={() => deletarFeedback(f.id)}>
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </main>
  )
}
