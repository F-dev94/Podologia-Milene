"use client"

// Componente do formulario de agendamento
// Envia os dados pro backend via fetch POST

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, User, CheckCircle2, Loader2 } from "lucide-react"
import { ptBR } from "date-fns/locale"

// horarios disponiveis (mesmo do backend)
const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
]

// lista de servicos
const serviceOptions = [
  "Tratamento de Calos", "Corte de Unhas", "Tratamento de Micoses",
  "Hidratacao Profunda", "Unha Encravada", "Pe Diabetico", "Avaliacao Geral",
]

export function AppointmentForm() {
  // estados do formulario
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [servico, setServico] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  // funcao que envia o formulario pro backend
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro("")

    try {
      // monta o objeto com os dados
      const dados = {
        nome: nome,
        telefone: telefone,
        email: email,
        servico: servico,
        data: date?.toISOString().split("T")[0], // pega so a data YYYY-MM-DD
        horario: time,
      }

      // faz o POST pra API
      const resposta = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })

      const resultado = await resposta.json()

      if (resultado.sucesso) {
        // deu certo!
        setSubmitted(true)
      } else {
        // deu algum erro (tipo horario ocupado)
        setErro(resultado.mensagem || "Erro ao agendar. Tente novamente.")
      }
    } catch {
      // erro de conexao ou algo assim
      setErro("Erro de conexao. Verifique sua internet e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // funcao pra resetar o formulario
  function resetarFormulario() {
    setDate(undefined)
    setTime("")
    setNome("")
    setTelefone("")
    setEmail("")
    setServico("")
    setSubmitted(false)
    setErro("")
  }

  // tela de sucesso
  if (submitted) {
    return (
      <section id="agendar" className="bg-card py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground">Agendamento Confirmado!</h2>
          <p className="text-lg text-muted-foreground">
            Obrigado, {nome}! Seu agendamento para {date?.toLocaleDateString("pt-BR")} as {time} foi registrado.
          </p>
          <p className="text-sm text-muted-foreground">Entraremos em contato pelo telefone {telefone} para confirmar.</p>
          <Button className="mt-4" onClick={resetarFormulario}>Novo Agendamento</Button>
        </div>
      </section>
    )
  }

  return (
    <section id="agendar" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground uppercase tracking-wide">
            Agendamento
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Agende sua consulta online
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Escolha a data, horario e servico desejado.
          </p>
        </div>

        {/* mensagem de erro */}
        {erro && (
          <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-14 grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* card da data e horario */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 font-serif text-lg text-foreground">
                <CalendarDays className="h-5 w-5 text-primary" /> Data e Horario
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                  disabled={(d) => d < new Date() || d.getDay() === 0}
                  className="rounded-lg border border-border"
                />
              </div>
              {date && (
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Clock className="h-4 w-4 text-primary" /> Horario
                  </Label>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          time === t
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* card dos dados pessoais */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 font-serif text-lg text-foreground">
                <User className="h-5 w-5 text-primary" /> Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" placeholder="Seu nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 99999-9999" required value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="service">Servico</Label>
                <Select required value={servico} onValueChange={setServico}>
                  <SelectTrigger><SelectValue placeholder="Selecione o servico" /></SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* resumo do agendamento */}
              {date && time && (
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="text-sm font-medium text-foreground">Resumo:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} as {time}
                  </p>
                  {servico && <p className="mt-1 text-sm text-muted-foreground">Servico: {servico}</p>}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full mt-2" disabled={!date || !time || !nome || !telefone || !email || !servico || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  "Confirmar Agendamento"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </section>
  )
}
