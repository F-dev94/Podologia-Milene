"use client"

import { useState, useEffect } from "react"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Feedback {
  id: number
  rating: number
  comment: string
  pacientes: { name: string }
}

export function Testimonials() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  useEffect(() => {
    async function loadFeedbacks() {
      try {
        const res = await fetch("/api/feedbacks?approved=true")
        const json = await res.json()
        if (json.sucesso) {
          setFeedbacks(json.dados || [])
        }
      } catch (e) {
        console.error("Erro ao carregar feedbacks:", e)
      }
    }
    loadFeedbacks()
  }, [])

  if (!feedbacks || feedbacks.length === 0) return null

  return (
    <section id="depoimentos" className="py-24 bg-slate-900 text-white px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">O que dizem nossos clientes</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            A satisfação de quem confia nos nossos cuidados é o nosso maior orgulho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((f) => (
            <Card key={f.id} className="bg-slate-800 border-none shadow-xl relative overflow-hidden group">
              <Quote className="absolute -top-4 -right-4 h-24 w-24 text-white/5 transition-transform group-hover:scale-110" />
              <CardContent className="p-8 relative z-10">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`h-5 w-5 ${f.rating >= s ? 'text-amber-400 fill-current' : 'text-slate-600'}`} 
                    />
                  ))}
                </div>
                <p className="text-lg text-slate-300 italic mb-8 leading-relaxed">
                  "{f.comment}"
                </p>
                <div className="flex items-center gap-4 border-t border-slate-700 pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl uppercase">
                    {f.pacientes?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{f.pacientes?.name || "Cliente"}</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-widest text-xs">Cliente Verificado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
