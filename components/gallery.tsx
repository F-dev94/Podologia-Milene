"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize2, X } from "lucide-react"

const images = [
  { src: "/images/gallery1.jpg", alt: "Procedimento de Podologia 1" },
  { src: "/images/gallery2.jpg", alt: "Clínica Equipada" },
  { src: "/images/gallery3.jpg", alt: "Tratamento Especializado" },
  { src: "/images/gallery4.jpg", alt: "Cuidado com os pés" },
  { src: "/images/gallery5.jpg", alt: "Ambiente Confortável" },
  { src: "/images/gallery6.jpg", alt: "Resultado de Tratamento" },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section id="galeria" className="py-24 bg-white px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Galeria de Resultados</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Confira alguns dos nossos tratamentos e a estrutura preparada para te atender.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl shadow-md transition-all hover:shadow-2xl"
              onClick={() => setSelectedImage(img.src)}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <Maximize2 className="text-white h-10 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-primary transition-colors">
            <X className="h-10 w-10" />
          </button>
          <div className="max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl">
            <img 
              src={selectedImage} 
              alt="Ampliado" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}
