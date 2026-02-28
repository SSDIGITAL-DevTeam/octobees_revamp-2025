import { ToastT } from 'sonner'

export const successToast: Omit<ToastT, 'id'> = {
    style: {
        background: 'rgba(0, 140, 0, 0.8)',
        color: 'white',
    },
    position: 'top-right',
    cancel: {
        label: 'X',
        onClick: () => {
            // @typescript-eslint/no-empty-function
        },
    },
}

export const failToast: Omit<ToastT, 'id'> = {
    style: {
        background: 'rgba(200, 0, 0, 0.8)',
        color: 'white',
    },
    position: 'top-right',
    cancel: {
        label: 'X',
        onClick: () => {
            // @typescript-eslint/no-empty-function
        },
    },
}
