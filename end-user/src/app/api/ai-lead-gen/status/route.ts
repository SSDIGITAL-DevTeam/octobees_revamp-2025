import { NextRequest, NextResponse } from 'next/server'
import { scanStatus } from '../_lib/scan-status'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { scan_id } = body

        if (!scan_id) {
            return NextResponse.json(
                { error: 'Missing required field: scan_id' },
                { status: 400 },
            )
        }

        const status = scanStatus.get(scan_id)

        if (!status) {
            return NextResponse.json(
                { error: 'Scan not found' },
                { status: 404 },
            )
        }

        return NextResponse.json({
            scan_id,
            ...status,
        })
    } catch (error) {
        console.error('Error in status endpoint:', error)
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to get status',
            },
            { status: 500 },
        )
    }
}
