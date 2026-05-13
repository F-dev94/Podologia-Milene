"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/app/lib/supabaseCliente"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, CalendarDays, Search, Trash2, Star, MessageSquare } from "lucide-react"

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
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Agendamento | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [sendingFeedback, setSendingFeedback] = useState(false)

  useEffect(() => {
    async function checarSessao() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUsuarioLogado(session.user)
        await carregarPorEmail(session.user.email!)
      }
    }
    checarSessao()
  }, [])

  async function carregarPorEmail(email: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/agendamentos?email=${email}`)
      const json = await res.json()
      if (json.sucesso) {
        setAgendamentos(json.dados)
        setBuscou(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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

  async function enviarFeedback(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedAppointment || !usuarioLogado) return

    setSendingFeedback(true)
    try {
      // Buscar o ID do paciente primeiro (ou usar um ID que já temos, mas a API de agendamentos retorna agendamentos, precisamos do patient_id)
      // Vamos assumir que a API de agendamentos poderia retornar o patient_id ou buscamos por e-mail
      const { data: paciente } = await supabase.from('pacientes').select('id').eq('email', usuarioLogado.email).single()
      
      if (!paciente) throw new Error("Paciente não encontrado")

      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: paciente.id,
          rating,
          comment
        })
      })
      const json = await res.json()
      if (json.sucesso) {
        alert("Obrigado pelo seu feedback! Ele será analisado pela Milene.")
        setShowFeedbackModal(false)
        setComment("")
        setRating(5)
      } else {
        alert("Erro ao enviar feedback: " + json.mensagem)
      }
    } catch (e) {
      alert("Erro ao enviar feedback.")
    } finally {
      setSendingFeedback(false)
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
              {usuarioLogado ? (
                <CardDescription className="text-white/80 mt-2 text-lg">
                  Bem-vindo, <b>{usuarioLogado.email}</b>. Abaixo estão seus horários.
                </CardDescription>
              ) : (
                <CardDescription className="text-white/80 mt-2 text-lg">
                  Digite seu telefone/WhatsApp para ver e gerenciar seus horários.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-8">
              {!usuarioLogado && (
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
              )}
              {usuarioLogado && (
                <div className="text-center">
                   <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => window.location.reload())}>
                     Sair da Conta
                   </Button>
                </div>
              )}
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
                  <p className="text-xl text-slate-500 font-medium">Nenhum agendamento encontrado.</p>
                </div>
              ) : (
                agendamentos.map(a => {
                  const isPast = new Date(a.data + "T23:59:59") < new Date()
                  return (
                    <Card key={a.id} className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${isPast ? 'border-l-slate-400 bg-slate-50' : 'border-l-primary'}`}>
                      <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
                          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold mb-1 ${isPast ? 'bg-slate-200 text-slate-600' : 'bg-primary/10 text-primary'}`}>
                            {a.servico} {isPast && "(Concluído)"}
                          </span>
                          <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2">
                            <p className={`text-2xl font-black tracking-tight ${isPast ? 'text-slate-500' : 'text-slate-800'}`}>{a.horario}</p>
                            <p className="text-lg text-slate-500 font-medium">{new Date(a.data + "T12:00:00").toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                          {isPast ? (
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="w-full sm:w-auto h-12 font-bold border-primary text-primary hover:bg-primary/10"
                              onClick={() => {
                                setSelectedAppointment(a)
                                setShowFeedbackModal(true)
                              }}
                            >
                              <Star className="mr-2 h-5 w-5" /> Avaliar Atendimento
                            </Button>
                          ) : (
                            <Button 
                              variant="destructive" 
                              size="lg" 
                              className="w-full sm:w-auto h-12 font-bold"
                              onClick={() => cancelarAgendamento(a.id, a.data, a.horario, a.servico)}
                            >
                              <Trash2 className="mr-2 h-5 w-5" /> Cancelar Horário
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          )}

          {/* Modal de Feedback */}
          {showFeedbackModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200">
                <CardHeader className="bg-primary text-white rounded-t-xl relative">
                  <button 
                    onClick={() => setShowFeedbackModal(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <CardTitle className="text-2xl font-serif">Sua Avaliação</CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Como foi o serviço de <b>{selectedAppointment?.servico}</b>?
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={enviarFeedback} className="space-y-6">
                    <div className="space-y-3 text-center">
                      <Label className="text-lg font-bold text-slate-800 block">Sua Nota</Label>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-1 transition-transform hover:scale-125 ${rating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                          >
                            <Star className="h-10 w-10 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" /> Comentário
                      </Label>
                      <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Conte como foi sua experiência..."
                        className="w-full min-h-[120px] rounded-xl border border-slate-200 p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <Button type="submit" className="w-full h-14 text-xl font-bold" disabled={sendingFeedback}>
                      {sendingFeedback ? <Loader2 className="h-6 w-6 animate-spin" /> : "ENVIAR AVALIAÇÃO"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
