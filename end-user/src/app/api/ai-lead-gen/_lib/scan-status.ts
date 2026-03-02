// Store untuk in-memory scan status (dalam production gunakan database/redis)
const globalForScan = globalThis as unknown as {
    scanStatus: Map<string, any>
    scanInterval: NodeJS.Timeout
}

export const scanStatus = globalForScan.scanStatus || new Map<string, any>()

if (process.env.NODE_ENV !== 'production') {
    globalForScan.scanStatus = scanStatus
}

// Cleanup old scans setiap 1 jam
if (!globalForScan.scanInterval) {
    globalForScan.scanInterval = setInterval(() => {
        const now = Date.now()
        const oneHourAgo = now - 3600000

        const keysToDelete: string[] = []
        scanStatus.forEach((value, key) => {
            if (
                value.createdAt &&
                value.createdAt < oneHourAgo &&
                value.completed
            ) {
                keysToDelete.push(key)
            }
        })

        keysToDelete.forEach((key) => scanStatus.delete(key))
    }, 3600000)
}

export function updateScanStatus(scanId: string, updates: Partial<any>) {
    const current = scanStatus.get(scanId) || {}
    scanStatus.set(scanId, { ...current, ...updates })
}
