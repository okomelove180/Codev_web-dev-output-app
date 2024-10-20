import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const goalId = params.id
  const { completed } = await request.json()

  try {
    const updatedGoal = await prisma.learningGoal.update({
      where: { id: goalId },
      data: { completed },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error('Failed to update learning goal:', error)
    return NextResponse.json({ error: 'Failed to update learning goal' }, { status: 500 })
  }
}