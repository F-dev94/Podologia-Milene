"use client"

import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function Location() {
  const address = "Rua do Limoeiro, Nº 121 - Olímpia - SP"
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  
  return (
    <section id="localizacao" className="py-24 bg-slate-50 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Nossa Localização</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Estamos prontos para te receber com todo conforto no centro de Olímpia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          <Card className="lg:col-span-1 border-none shadow-xl bg-white overflow-hidden flex flex-col">
            <div className="bg-primary p-8 text-white">
              <MapPin className="h-12 w-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Onde Estamos</h3>
              <p className="text-white/90 leading-relaxed text-lg">
                {address}
              </p>
            </div>
            <CardContent className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Local de fácil acesso, com estacionamento próximo e ambiente climatizado para o seu bem-estar.
                </p>
              </div>
              
              <Button asChild className="w-full h-16 text-lg font-bold mt-8 shadow-lg hover:shadow-primary/20">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="mr-2 h-6 w-6" /> ABRIR NO GPS / MAPS
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl border-4 border-white min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14902.13840618037!2d-48.9160533!3d-20.7381273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94bb9f33887b7a63%3A0xe51025732168478c!2zT2zDrW1waWEsIFNQ!5e0!3m2!1spt-BR!2sbr!4v1715562000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
