import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  { name: "Maria Silva", text: "Atendimento incrivel! A equipe e super atenciosa e o ambiente e muito acolhedor." },
  { name: "Ana Oliveira", text: "Profissionais excelentes! Resolveram minha unha encravada rapidamente e sem dor." },
  { name: "Juliana Santos", text: "Ja vejo resultado no tratamento de micose. Consultorio limpissimo. Nota 10!" },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground uppercase tracking-wide">
            Depoimentos
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            O que nossas clientes dizem
          </h2>
        </div>

        <div className="mt-14 grid gap-6 grid-cols-1 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border border-border">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic">{`"${t.text}"`}</p>
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
