import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer id="contato" className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-4">
              <Image src="/images/Milena2.jpeg" alt="Logomarca Milene Podóloga" width={160} height={160} className="object-contain bg-white rounded-xl p-2" />
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Cuidando da saúde dos seus pés com carinho e profissionalismo há mais de 21 anos.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold">Navegação</h3>
            <nav className="flex flex-col gap-2">
              {["Início", "Serviços", "Sobre", "Agendar"].map((l) => (
                <Link key={l} href={`/#${l.toLowerCase()}`} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                  {l}
                </Link>
              ))}
              <Link href="/meus-agendamentos" className="text-sm font-bold text-primary opacity-90 hover:opacity-100 transition-opacity mt-2">
                Meus Agendamentos
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold">Contato</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                <p className="text-sm opacity-70">Rua do Limoeiro, Nº 121 - Olímpia - SP</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 opacity-70" />
                <Link href="tel:+5517997617188" className="text-sm opacity-70 hover:opacity-100 transition-opacity">(17) 99761-7188</Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 opacity-70" />
                <Link href="mailto:millenepupio1@gmail.com" className="text-sm opacity-70 hover:opacity-100 transition-opacity">millenepupio1@gmail.com</Link>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="h-4 w-4 shrink-0 opacity-70" />
                <Link href="https://instagram.com/milenapupio" target="_blank" className="text-sm opacity-70 hover:opacity-100 transition-opacity">@milenapupio</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold">Horários</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Seg - Sáb: 07:00 - 11:00 | 12:00 - 19:00" },
                { label: "Domingo e Feriados: Fechado" }
              ].map((h) => (
                <div key={h.label} className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 opacity-70" />
                  <p className="text-sm opacity-70">{h.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-background/20 pt-8 text-center">
          <p className="text-sm opacity-50">{"Milene Perpétua Da Silva Rodrigues. Todos os direitos reservados."}</p>
        </div>
      </div>
    </footer>
  )
}
