import { NextRequest, NextResponse } from 'next/server'

import db from '@/lib/db'
import { z } from 'zod'

const UpdateAssessmentSchema = z.object({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
  score: z.number().min(0).max(100).nullable(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    const body = await request.json()
    const validatedData = UpdateAssessmentSchema.parse(body)

    const updatedAssessment = await db.assessment.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      data: updatedAssessment,
      message: 'Assessment updated successfully',
    })
  } catch (error) {
    console.error('Failed to update assessment:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Validation error',
        message: error.errors.map(e => e.message).join(', '),
      }, { status: 400 })
    }
    return NextResponse.json({
      success: false,
      data: null,
      error: 'Failed to update assessment',
      message: 'An error occurred while updating the assessment',
    }, { status: 500 })
  }
}

