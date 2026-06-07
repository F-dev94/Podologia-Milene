import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

const highlights = [
  "Profissionais certificados",
  "Ambiente esterilizado e seguro",
  "Equipamentos modernos",
  "Atendimento humanizado",
  "Mais de 21 anos de experiência",
  "Preços acessíveis",
]

export function About() {
  return (
    <section id="sobre" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src="/images/Milena1.jpeg"
                alt="Milene Podóloga"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-xl bg-primary p-6 text-primary-foreground shadow-lg">
              <p className="text-3xl font-bold font-serif">21+</p>
              <p className="text-sm opacity-90">Anos de experiência</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground uppercase tracking-wide">
              Sobre Nós
            </span>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Dedicados ao cuidado dos seus pés
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Nossa clínica é referência em tratamentos especializados, com profissionais qualificados e um ambiente moderno e acolhedor.
            </p>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
