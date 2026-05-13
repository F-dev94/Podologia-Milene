import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabaseCliente"

export const dynamic = 'force-dynamic'

// GET - Buscar feedbacks (aprovados para a home, ou todos para o admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const onlyApproved = searchParams.get("approved") === "true"

    let query = supabase
      .from('feedbacks')
      .select(`
        id,
        rating,
        comment,
        approved,
        created_at,
        pacientes (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (onlyApproved) {
      query = query.eq('approved', true)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ sucesso: true, dados: data })
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao buscar feedbacks" }, { status: 500 })
  }
}

// POST - Criar novo feedback
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patient_id, rating, comment } = body

    if (!patient_id || !rating || !comment) {
      return NextResponse.json({ sucesso: false, mensagem: "Dados incompletos" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('feedbacks')
      .insert([{
        patient_id,
        rating,
        comment,
        approved: false // Sempre começa como não aprovado
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ sucesso: true, mensagem: "Feedback enviado! Aguarde aprovação." })
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao salvar feedback" }, { status: 500 })
  }
}

// PATCH - Aprovar feedback (Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, approved } = body

    if (!id) return NextResponse.json({ sucesso: false, mensagem: "ID não fornecido" }, { status: 400 })

    const { error } = await supabase
      .from('feedbacks')
      .update({ approved })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ sucesso: true, mensagem: "Status atualizado com sucesso!" })
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao atualizar status" }, { status: 500 })
  }
}

// DELETE - Remover feedback
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ sucesso: false, mensagem: "ID não fornecido" }, { status: 400 })

    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ sucesso: true, mensagem: "Removido com sucesso!" })
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao remover" }, { status: 500 })
  }
}
