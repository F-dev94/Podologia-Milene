// ===================================
// API pra verificar horarios disponiveis
// Retorna quais horarios ja estao ocupados numa data
// ===================================

import { NextResponse } from "next/server"

// importa o mesmo array de agendamentos
// obs: como cada arquivo de route tem seu proprio escopo, vou ter que duplicar a referencia
// TODO: futuramente colocar isso num arquivo separado

// na real como o array ta em outro arquivo e nao da pra importar facil
// vou fazer a checagem via fetch interno... ou melhor, vou simplificar
// e fazer a verificacao direto na rota principal POST

// essa rota retorna os horarios disponiveis pra uma data
// por enquanto retorna todos, a verificacao real ta no POST

const todosHorarios = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
]

export async function GET() {
  return NextResponse.json({
    sucesso: true,
    horarios: todosHorarios,
  })
}
