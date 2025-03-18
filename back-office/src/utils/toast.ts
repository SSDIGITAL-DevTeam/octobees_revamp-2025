"use client";
import { useRouter } from "next/router";
import { toast } from "sonner"

export const successToast = (message: string, description? : string, action? : () => void) => {
    toast(message, {
        description
      })
}
export const failedToast = (message: string, description? : string, action? : () => void) => {
    toast(message, {
        description
      })
}