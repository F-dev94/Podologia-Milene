import { Card, CardContent } from "@/components/ui/card"
import { Footprints, Scissors, Microscope, Droplets, ShieldCheck, Heart, CheckCircle2 } from "lucide-react"

const services = [
  { icon: Scissors, title: "Mão", desc: "Corte técnico e cuidados para as mãos.", price: "R$ 35" },
  { icon: Footprints, title: "Pé", desc: "Corte técnico e cuidados para os pés.", price: "R$ 40" },
  { icon: Heart, title: "Profilaxia laminar", desc: "Limpeza e tratamento das unhas.", price: "R$ 120" },
  { icon: Heart, title: "Profilaxia laminar + plantar", desc: "Tratamento completo para unhas e planta dos pés.", price: "R$ 160" },
  { icon: Droplets, title: "Desbaste plantar", desc: "Remoção de calosidades na planta dos pés.", price: "R$ 80" },
  { icon: Droplets, title: "Remoção de calo", desc: "Remoção segura de calos e calosidades.", price: "A partir de R$ 60" },
  { icon: Microscope, title: "Remoção de tungíase", desc: "Tratamento para remoção de bicho-de-pé.", price: "R$ 60" },
  { icon: ShieldCheck, title: "Espicolectomia", desc: "Remoção de unha encravada.", price: "A partir de R$ 150" },
  { icon: CheckCircle2, title: "Tratamento onicomicose", desc: "Tratamento especializado para micoses nas unhas.", price: "R$ 150" },
  { icon: Droplets, title: "Pilling químico", desc: "Renovação celular e tratamento profundo.", price: "R$ 150" },
]

export function Services() {
  return (
    <section id="servicos" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground uppercase tracking-wide">
            Nossos Serviços
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Cuidados completos para seus pés
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-800 font-medium">
            Tratamentos podológicos para atender todas as suas necessidades.
          </p>
        </div>

        <div className="mt-14 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.title} className="group border border-border bg-background transition-all hover:shadow-lg hover:border-primary/30">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-base leading-relaxed text-slate-700 font-medium">{s.desc}</p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <p className="text-2xl font-black text-slate-900 bg-slate-100 p-3 rounded-lg text-center border-2 border-slate-200">
                    {s.price}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
