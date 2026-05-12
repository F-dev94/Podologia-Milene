// ===================================
// API de Agendamentos - Podologia (Refatorado para Supabase)
// ===================================

import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabaseCliente"

export const dynamic = 'force-dynamic' // Garante que o Next.js não faça cache dessa rota
export const revalidate = 0

// rota GET - buscar todos os agendamentos
export async function GET() {
  try {
    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select(`
        id,
        date,
        time,
        service_name_snapshot,
        price,
        created_at,
        pacientes (
          name,
          phone,
          email
        )
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: false })

    if (error) {
      console.error("Erro do Supabase:", error)
      throw error
    }

    // Mapear para o formato que o frontend Admin espera (ou muito próximo)
    const dadosMapeados = agendamentos.map((a: any) => {
      const p = Array.isArray(a.pacientes) ? a.pacientes[0] : a.pacientes
      return {
        id: a.id,
        nome: p?.name || 'Desconhecido',
        telefone: p?.phone || '',
        email: p?.email || '',
        servico: a.service_name_snapshot,
        data: a.date,
        horario: a.time,
        price: a.price,
        criadoEm: a.created_at
      }
    })

    return NextResponse.json({
      sucesso: true,
      total: dadosMapeados.length,
      dados: dadosMapeados,
    })
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao buscar do banco de dados." },
      { status: 500 }
    )
  }
}

// rota POST - criar um novo agendamento
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.nome || !body.telefone || !body.email || !body.servico || !body.data || !body.horario) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Preencha todos os campos!" },
        { status: 400 }
      )
    }

    // PASSO 1: Salva o Paciente. 
    const { data: paciente, error: errorPaciente } = await supabase
      .from('pacientes')
      .upsert(
        { name: body.nome, phone: body.telefone, email: body.email },
        { onConflict: 'email' }
      )
      .select()
      .single()

    if (errorPaciente) throw errorPaciente

    // PASSO 2: Cria o Agendamento vinculado
    const { data: agendamento, error: errorAgenda } = await supabase
      .from('agendamentos')
      .insert([{
        patient_id: paciente.id,
        date: body.data,
        time: body.horario,
        service_name_snapshot: body.servico,
        price: 0
      }])
      .select()
      .single()

    if (errorAgenda) throw errorAgenda

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Agendamento realizado com sucesso!",
        agendamento: agendamento,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Deu erro:", error)
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro no servidor ao salvar." },
      { status: 500 }
    )
  }
}

// rota DELETE - deletar um agendamento pelo id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { sucesso: false, mensagem: "ID não fornecido!" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      sucesso: true,
      mensagem: "Agendamento cancelado com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao deletar:", error)
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao cancelar agendamento." },
      { status: 500 }
    )
  }
}

// rota PATCH - Atualizar dados do agendamento (ex: preço)
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, price } = body
    
    if (!id || price === undefined) {
      return NextResponse.json({ sucesso: false, mensagem: "Dados incompletos" }, { status: 400 })
    }

    const { error } = await supabase
      .from('agendamentos')
      .update({ price })
      .eq('id', id)
      
    if (error) throw error
    
    return NextResponse.json({ sucesso: true, mensagem: "Atualizado com sucesso" })
  } catch(error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao atualizar" }, { status: 500 })
  }
}
