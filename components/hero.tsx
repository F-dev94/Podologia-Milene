import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const stats = [
  { value: "500+", label: "Clientes atendidos" },
  { value: "21+", label: "Anos de experiência" },
  { value: "98%", label: "Satisfação" },
]

export function Hero() {
  return (
    <section id="inicio" className="mx-auto max-w-7xl px-6 py-20 md:py-32">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground uppercase tracking-wide">
            Cuidado profissional
          </span>
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Seus pés merecem cuidado especializado
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Oferecemos tratamentos podológicos de excelência com profissionais qualificados. Agende sua consulta e cuide da saúde dos seus pés.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button size="lg" asChild>
              <Link href="#agendar" className="gap-2">
                Agendar Agora <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#servicos">Nossos Serviços</Link>
            </Button>
          </div>
          <div className="flex items-center gap-8 pt-4">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-8">
                {i > 0 && <div className="h-10 w-px bg-border" />}
                <div>
                  <p className="text-2xl font-bold text-foreground font-serif">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/Milena1.jpeg"
              alt="Milene Podóloga"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
