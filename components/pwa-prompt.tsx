"use client"

import { useState, useEffect } from "react"
import { X, Smartphone, Share, PlusSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PwaPrompt() {
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // 1. Verificar se já está instalado (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone 
                         || document.referrer.includes('android-app://')

    if (isStandalone) return

    // 2. Detectar se é iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(ios)

    // 3. Verificar se o usuário já fechou o banner nesta sessão
    const hasDismissed = sessionStorage.getItem('pwa-prompt-dismissed')
    
    // Mostrar apenas em dispositivos móveis
    const isMobile = /android|iphone|ipad|ipod/.test(userAgent)

    if (isMobile && !hasDismissed) {
      // Pequeno delay para não assustar o usuário
      setTimeout(() => setIsVisible(true), 3000)
    }
  }, [])

  const dismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white border-2 border-primary shadow-2xl rounded-2xl p-5 relative overflow-hidden">
        <button 
          onClick={dismiss}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex gap-4 items-start">
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <Smartphone className="h-8 w-8" />
          </div>
          
          <div className="space-y-1 pr-6">
            <h4 className="font-bold text-slate-900 text-lg">Instale nosso Aplicativo!</h4>
            <p className="text-sm text-slate-600 leading-tight">
              {isIOS 
                ? "Agende seus horários muito mais rápido sem precisar abrir o navegador."
                : "Tenha a Podologia Milene sempre à mão na sua tela inicial."
              }
            </p>
          </div>
        </div>

        <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-xs font-bold text-slate-800 uppercase mb-2 flex items-center gap-2">
            Como instalar:
          </p>
          
          {isIOS ? (
            <div className="text-sm text-slate-700 space-y-2">
              <p className="flex items-center gap-2">
                1. Toque no botão de compartilhar <Share className="h-4 w-4 text-blue-500" /> abaixo.
              </p>
              <p className="flex items-center gap-2">
                2. Role e toque em <b>'Adicionar à Tela de Início'</b> <PlusSquare className="h-4 w-4" />.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-700">
              Toque nos <b>três pontinhos (⋮)</b> do navegador e selecione <b>"Instalar Aplicativo"</b> ou <b>"Adicionar à tela inicial"</b>.
            </p>
          )}
        </div>

        <Button 
          className="w-full mt-4 h-12 font-bold" 
          onClick={dismiss}
        >
          ENTENDI
        </Button>
      </div>
    </div>
  )
}
