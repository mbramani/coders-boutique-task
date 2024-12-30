import { NextRequest, NextResponse } from 'next/server'

import db from '@/lib/db'
import { z } from 'zod'

const QuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  perPage: z.string().regex(/^\d+$/).transform(Number).default('10'),
  sortBy: z.enum(['title', 'status', 'score', 'dateAssigned']).default('dateAssigned'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = QuerySchema.parse(Object.fromEntries(searchParams))

    const skip = (query.page - 1) * query.perPage
    const take = query.perPage

    const where = query.search
      ? {
          title: {
            contains: query.search,
            mode: 'insensitive' as const,
          },
        }
      : {}

    const [assessments, totalCount] = await Promise.all([
      db.assessment.findMany({
        where,
        skip,
        take,
        orderBy: { [query.sortBy]: query.sortOrder },
      }),
      db.assessment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        assessments,
        pagination: {
          total: totalCount,
          page: query.page,
          perPage: query.perPage,
          pageCount: Math.ceil(totalCount / query.perPage),
        },
      },
      message: 'Assessments fetched successfully',
    })
  } catch (error) {
    console.error('Failed to fetch assessments:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Invalid query parameters',
        message: error.errors.map(e => e.message).join(', '),
      }, { status: 400 })
    }
    return NextResponse.json({
      success: false,
      data: null,
      error: 'Failed to fetch assessments',
      message: 'An error occurred while fetching assessments',
    }, { status: 500 })
  }
}
