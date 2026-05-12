"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicos", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Agendar", href: "#agendar" },
  { label: "Contato", href: "#contato" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="#inicio" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-primary-foreground">P</span>
          </div>
          <span className="font-serif text-xl font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap hidden sm:block">Milene Perpétua Da Silva Rodrigues</span>
          <span className="font-serif text-xl font-bold text-foreground sm:hidden">Podologia Milene</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="tel:+551799767188" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors pr-2 border-r">
            <Phone className="h-4 w-4" />
            (17) 9976-7188
          </Link>
          <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2">
            Entrar
          </Link>
          <Button asChild>
            <Link href="#agendar">Agendar</Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-base text-muted-foreground hover:text-primary transition-colors" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="h-px w-full bg-border" />
          <Link href="/login" className="text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setOpen(false)}>
            Entrar / Cadastrar
          </Link>
          <Button asChild className="w-full">
            <Link href="#agendar" onClick={() => setOpen(false)}>Agendar Consulta</Link>
          </Button>
        </nav>
      )}
    </header>
  )
}
