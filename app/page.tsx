"use client"

import { useState, useEffect } from "react"
import { supabase } from "./lib/supabaseCliente" 

// Seus componentes de layout
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { Gallery } from "@/components/gallery"
import { Testimonials } from "@/components/testimonials"
import { Location } from "@/components/location"
import { Footer } from "@/components/footer"

// Componentes da UI
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    servico: "",
    data: "",
    horario: ""
  })
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([])
  
  // Impede seleção de datas passadas
  const getToday = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  }

  // Busca horários ocupados quando a data muda
  useEffect(() => {
    if (!formData.data) {
      setHorariosOcupados([])
      return
    }
    async function buscarOcupados() {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('time')
        .eq('date', formData.data)
      
      if (!error && data) {
        setHorariosOcupados(data.map(d => d.time))
      }
    }
    buscarOcupados()
  }, [formData.data])

  // Verifica se o dia todo está ocupado (13 horários possíveis)
  const todosHorariosDisponiveis = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
  const diaInteiroFechado = formData.data && horariosOcupados.length >= todosHorariosDisponiveis.length;

  async function handleAgendamento(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Validação estrita de telefone (pelo menos 10 dígitos)
    const numeroLimpo = formData.telefone.replace(/\D/g, "");
    if (numeroLimpo.length < 10) {
      alert("❌ Por favor, digite um número de telefone ou celular válido com o DDD.")
      setLoading(false)
      return
    }

    try {
      // PASSO 0: Verificar se o horário já está ocupado
      const { data: horarioOcupado, error: erroChecagem } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('date', formData.data)
        .eq('time', formData.horario)

      if (erroChecagem) throw erroChecagem

      if (horarioOcupado && horarioOcupado.length > 0) {
        alert("❌ Este horário já está reservado. Por favor, escolha outro.")
        setLoading(false)
        return
      }

      // PASSO 1: Salva o Paciente. 
      // Se o email já existir, ele apenas retorna os dados do paciente existente.
      const { data: paciente, error: errorPaciente } = await supabase
        .from('pacientes')
        .upsert(
          { name: formData.nome, phone: formData.telefone, email: formData.email },
          { onConflict: 'email' }
        )
        .select()
        .single()

      if (errorPaciente) throw errorPaciente

      // Descobre o preço base
      let precoSelecionado = 0;
      const s = formData.servico;
      if (s === "Mão") precoSelecionado = 35;
      else if (s === "Pé") precoSelecionado = 40;
      else if (s === "Profilaxia laminar") precoSelecionado = 120;
      else if (s === "Profilaxia laminar + plantar") precoSelecionado = 160;
      else if (s === "Desbaste plantar") precoSelecionado = 80;
      else if (s === "Remoção de calo") precoSelecionado = 60;
      else if (s === "Remoção de tungíase") precoSelecionado = 60;
      else if (s === "Espicolectomia") precoSelecionado = 150;
      else if (s === "Tratamento onicomicose") precoSelecionado = 150;
      else if (s === "Pilling químico") precoSelecionado = 150;

      // PASSO 2: Cria o Agendamento vinculado ao ID do paciente encontrado acima
      const { error: errorAgenda } = await supabase
        .from('agendamentos')
        .insert([{
          patient_id: paciente.id,
          date: formData.data,
          time: formData.horario,
          service_name_snapshot: formData.servico,
          price: precoSelecionado // Valor inicial baseado na seleção
        }])

      if (errorAgenda) throw errorAgenda

      // Formatar a mensagem do WhatsApp
      const dataFormatada = formData.data.split('-').reverse().join('/');
      const mensagem = `Olá, Podologia Milene!\nGostaria de confirmar meu agendamento.\n\n*Nome:* ${formData.nome}\n*Serviço:* ${formData.servico}\n*Data:* ${dataFormatada}\n*Horário:* ${formData.horario}`;
      const urlWhatsapp = `https://wa.me/551799767188?text=${encodeURIComponent(mensagem)}`;

      alert("✅ Agendamento salvo! Você será redirecionado para o WhatsApp da clínica para confirmar.");
      window.open(urlWhatsapp, '_blank');
      
      setFormData({ nome: "", telefone: "", email: "", servico: "", data: "", horario: "" })
      
    } catch (error: any) {
      console.error("Erro completo:", error)
      alert("Erro ao processar: " + (error.message || "Verifique a conexão"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <About />

        <section id="agendar" className="py-20 bg-slate-50">
          <div className="mx-auto max-w-4xl px-6">
            <Card className="border-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-primary p-8 text-white text-center">
                <CardTitle className="text-3xl font-serif">Agende seu Atendimento</CardTitle>
                <p className="opacity-90">Escolha o melhor horário para seus pés</p>
              </CardHeader>
              
              <CardContent className="p-8 bg-white">
                <form onSubmit={handleAgendamento} className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-lg font-bold text-slate-900">Nome Completo</Label>
                    <Input 
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={e => setFormData({...formData, nome: e.target.value})}
                      required 
                      className="h-14 text-lg border-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-bold text-slate-900">Telefone / WhatsApp</Label>
                    <Input 
                      placeholder="(17) 99999-9999"
                      value={formData.telefone}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length > 11) v = v.substring(0, 11);
                        if (v.length > 2) v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
                        if (v.length > 10) v = `${v.substring(0, 10)}-${v.substring(10)}`;
                        setFormData({...formData, telefone: v});
                      }}
                      required 
                      maxLength={15}
                      className="h-14 text-lg border-slate-400"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-lg font-bold text-slate-900">E-mail</Label>
                    <Input 
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required 
                      className="h-14 text-lg border-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-bold text-slate-900">Tratamento</Label>
                    <Select onValueChange={v => setFormData({...formData, servico: v})} required>
                      <SelectTrigger className="h-14 text-lg border-slate-400 text-slate-900 font-medium"><SelectValue placeholder="O que você precisa?" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mão">Mão (R$ 35)</SelectItem>
                        <SelectItem value="Pé">Pé (R$ 40)</SelectItem>
                        <SelectItem value="Profilaxia laminar">Profilaxia laminar (R$ 120)</SelectItem>
                        <SelectItem value="Profilaxia laminar + plantar">Profilaxia laminar + plantar (R$ 160)</SelectItem>
                        <SelectItem value="Desbaste plantar">Desbaste plantar (R$ 80)</SelectItem>
                        <SelectItem value="Remoção de calo">Remoção de calo (A partir de R$ 60)</SelectItem>
                        <SelectItem value="Remoção de tungíase">Remoção de tungíase (R$ 60)</SelectItem>
                        <SelectItem value="Espicolectomia">Espicolectomia - Unha encravada (150+)</SelectItem>
                        <SelectItem value="Tratamento onicomicose">Tratamento onicomicose (R$ 150)</SelectItem>
                        <SelectItem value="Pilling químico">Pilling químico (R$ 150)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-lg font-bold text-slate-900">Data</Label>
                      <Input 
                        type="date" 
                        min={getToday()}
                        value={formData.data} 
                        onChange={e => setFormData({...formData, data: e.target.value, horario: ""})} 
                        className={`h-14 text-lg border-slate-400 font-medium ${diaInteiroFechado ? "border-red-500 bg-red-50 text-red-700" : ""}`}
                        required 
                      />
                      {diaInteiroFechado && <p className="text-xs text-red-600 font-bold mt-1">Dia totalmente lotado</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-bold text-slate-900">Hora</Label>
                      <Select 
                        value={formData.horario} 
                        onValueChange={v => setFormData({...formData, horario: v})} 
                        required
                        disabled={diaInteiroFechado}
                      >
                        <SelectTrigger className={`h-14 text-lg font-bold border-slate-400 text-slate-900 ${diaInteiroFechado ? "bg-slate-100" : ""}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {todosHorariosDisponiveis.map(hora => (
                             <SelectItem key={hora} value={hora} disabled={horariosOcupados.includes(hora)}>
                               {hora} {horariosOcupados.includes(hora) ? "(Ocupado)" : ""}
                             </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="md:col-span-2 h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "CONFIRMAR AGENDAMENTO"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <Gallery />
        <Testimonials />
        <Location />
      </main>
      <Footer />
    </div>
  )
}