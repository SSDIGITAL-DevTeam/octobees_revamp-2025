export function setCookie(name: string, value: string, days: number = 30) {
    let expires = ''
    if (days) {
        const date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = '; expires=' + date.toUTCString()
    }
    document.cookie =
        name + '=' + encodeURIComponent(value) + expires + '; path=/'
}

export function getCookie(name: string): string | null {
    const nameEQ = name + '='
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length)
        }
    }
    return null
}

export function deleteCookie(name: string) {
    setCookie(name, '', -1)
}
