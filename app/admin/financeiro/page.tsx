// ===================================
// Pagina do Financeiro - Acessível e Responsiva
// ===================================

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, DollarSign, RefreshCw, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface Agendamento {
  id: string
  nome: string
  telefone: string
  servico: string
  data: string
  horario: string
  price: number
}

export default function FinanceiroPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [editPriceId, setEditPriceId] = useState<string | null>(null)
  const [editPriceValue, setEditPriceValue] = useState("")

  async function buscarAgendamentos() {
    setCarregando(true)
    setErro("")
    try {
      const res = await fetch("/api/agendamentos", { cache: 'no-store' })
      const dados = await res.json()
      if (dados.sucesso) {
        setAgendamentos(dados.dados)
      } else {
        setErro("Erro ao buscar dados financeiros")
      }
    } catch {
      setErro("Erro de conexao com o servidor")
    } finally {
      setCarregando(false)
    }
  }

  async function salvarPreco(id: string) {
    try {
      const numValue = parseFloat(editPriceValue.replace(',', '.'))
      if (isNaN(numValue)) return alert("Por favor, digite um valor numérico válido (ex: 80.50)")

      const res = await fetch("/api/agendamentos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: numValue })
      })
      
      const resData = await res.json()
      if (resData.sucesso) {
        setAgendamentos(agendamentos.map(a => a.id === id ? { ...a, price: numValue } : a))
        setEditPriceId(null)
      } else {
        alert("Erro ao salvar o valor.")
      }
    } catch (e) {
      alert("Erro de conexão com o banco.")
    }
  }

  useEffect(() => {
    buscarAgendamentos()
  }, [])

  const faturamentoTotal = agendamentos.reduce((acc, a) => acc + (a.price || 0), 0)
  const faturamentoHoje = agendamentos
    .filter(a => a.data === new Date().toISOString().split("T")[0])
    .reduce((acc, a) => acc + (a.price || 0), 0)

  return (
    <main className="min-h-screen bg-slate-50 text-foreground pb-20">
      <header className="bg-green-700 text-white shadow-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <Link href="/admin" className="inline-flex items-center gap-2 text-green-100 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-medium">Voltar para a Agenda</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold mt-2 text-white">Meu Caixa Financeiro</h1>
          </div>
          <Button variant="secondary" size="lg" className="h-14 w-full sm:w-auto text-lg font-bold text-green-800" onClick={buscarAgendamentos} disabled={carregando}>
            <RefreshCw className={`mr-2 h-6 w-6 ${carregando ? "animate-spin" : ""}`} />
            Atualizar Caixa
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        
        {/* Painéis Grandes de Faturamento */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
          <Card className="border-none shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="flex flex-col items-start gap-4 p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <p className="text-2xl font-bold opacity-90">Faturamento Total</p>
              </div>
              <p className="text-5xl lg:text-6xl font-black mt-2 tracking-tight">
                R$ {faturamentoTotal.toFixed(2).replace('.', ',')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-green-50/80">
            <CardContent className="flex flex-col items-start gap-4 p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-200">
                  <DollarSign className="h-8 w-8 text-green-800" />
                </div>
                <p className="text-2xl font-bold text-green-800">Ganhos de Hoje</p>
              </div>
              <p className="text-5xl lg:text-6xl font-black text-green-700 mt-2 tracking-tight">
                R$ {faturamentoHoje.toFixed(2).replace('.', ',')}
              </p>
            </CardContent>
          </Card>
        </div>

        {erro && <div className="mb-6 rounded-xl bg-red-100 p-6 text-red-700 text-center text-xl font-bold">{erro}</div>}

        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
          Atendimentos (Cobranças)
        </h2>

        {carregando ? (
          <div className="py-20 text-center">
            <RefreshCw className="mx-auto h-16 w-16 animate-spin text-green-600/50" />
            <p className="mt-6 text-2xl font-medium text-slate-500">Calculando faturamentos...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {agendamentos.map((a) => (
              <Card key={a.id} className="border-none shadow-md overflow-hidden">
                <div className="min-h-3 w-full bg-slate-200 flex">
                  {a.price > 0 && <div className="w-full bg-green-500 h-full" />}
                </div>
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">{a.nome}</h3>
                    <p className="text-xl text-slate-600">{a.servico}</p>
                    <p className="text-lg font-medium text-slate-400 mt-2">
                      Realizado em {new Date(a.data + "T12:00:00").toLocaleDateString("pt-BR")} às {a.horario}
                    </p>
                  </div>

                  <div className="w-full md:w-auto bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[300px]">
                    {editPriceId === a.id ? (
                      <div className="space-y-4">
                        <Label className="text-xl font-bold text-slate-700">Digite o Valor da Sessão</Label>
                        <div className="flex items-center gap-3 text-2xl font-bold text-slate-600">
                          R$ 
                          <Input 
                            type="number" 
                            value={editPriceValue} 
                            onChange={e => setEditPriceValue(e.target.value)}
                            className="h-16 text-3xl font-black bg-white"
                            step="0.01"
                            autoFocus
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button 
                            size="lg" 
                            className="flex-1 h-14 text-xl font-bold bg-green-600 hover:bg-green-700 text-white" 
                            onClick={() => salvarPreco(a.id)}
                          >
                            Salvar
                          </Button>
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="flex-1 h-14 text-xl font-bold" 
                            onClick={() => setEditPriceId(null)}
                          >
                            Voltar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center md:items-end gap-4 relative">
                        {a.price > 0 ? (
                          <>
                            <div className="flex flex-col items-center md:items-end">
                              <span className="text-sm font-bold text-green-600 uppercase tracking-widest mb-1">Pago</span>
                              <span className="text-4xl font-black text-green-700">
                                R$ {(a.price || 0).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            <Button 
                              size="lg" 
                              variant="outline" 
                              className="w-full h-12 text-lg text-slate-500 font-bold" 
                              onClick={() => {
                                setEditPriceId(a.id)
                                setEditPriceValue(a.price?.toString() || "0")
                              }}
                            >
                              Corrigir Valor
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="text-center md:text-right pb-2">
                              <span className="text-2xl font-bold justify-self-end text-amber-600 block">Sem cobrança lançada</span>
                            </div>
                            <Button 
                              size="lg" 
                              className="w-full h-16 text-2xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg" 
                              onClick={() => {
                                setEditPriceId(a.id)
                                setEditPriceValue("0")
                              }}
                            >
                              Lançar Recebimento
                            </Button>
                          </>
                        )}
                      </div>
                    )}
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
