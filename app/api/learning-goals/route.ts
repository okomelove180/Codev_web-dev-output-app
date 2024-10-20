import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const { title, userId } = body

  try {
    const newGoal = await prisma.learningGoal.create({
      data: {
        title,
        description: '', // 必要に応じて説明を追加できます
        userId,
      },
    })

    return NextResponse.json(newGoal, { status: 201 })
  } catch (error) {
    console.error('Failed to create learning goal:', error)
    return NextResponse.json({ error: 'Failed to create learning goal' }, { status: 500 })
  }
}