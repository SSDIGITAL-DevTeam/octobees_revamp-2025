import logger from './logger.js'

export async function verifyRecaptchaToken(token) {
    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
    const url = 'https://www.google.com/recaptcha/api/siteverify'
    const params = new URLSearchParams()
    params.append('secret', RECAPTCHA_SECRET_KEY)
    params.append('response', token)

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    })

    const data = await response.json()
    logger.info(data)
    if (!data.success || data.score < 0.5) {
        throw new Error('Failed reCAPTCHA check or low score')
    }

    return data
}