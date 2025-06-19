"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { axiosInstance } from "@/lib/axios"
import { failedToast, successToast } from "@/utils/toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import InputField from "../form/InputField"
const dataSchema = z.object({
    password: z.string().nonempty(),
    newPassword: z.string().nonempty(),
    confirmNewPassword: z.string().nonempty()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
})

type ChangePasswordType = z.infer<typeof dataSchema>

type Props = {
    children: React.ReactNode,
    refetch: Dispatch<SetStateAction<boolean>>
}

export function DialogChangePassword({ children, refetch }: Props) {
    const form = useForm<ChangePasswordType>({
        defaultValues: {
            password: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        resolver: zodResolver(dataSchema),
    })
    const [open, setOpen] = useState<boolean>(false)
    const { control, reset, handleSubmit } = form


    const submitChangePassword = handleSubmit(async (value) => {
        try {
            await axiosInstance.post("/user", {
                
            })
            successToast("Position has been added")
        } catch (error) {
            failedToast("Failed to add position")
        } finally {
            refetch(prev => !prev)
            setOpen(false)
        }
    }
    )
    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[40vw] gap-8">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription className="hidden">Change Password</DialogDescription>
                </DialogHeader>
                <form onSubmit={submitChangePassword} className="space-y-6">
                    <div className="space-y-4">
                        <Label className="font-semibold">Position Name</Label>
                        {/* <InputField control={}/> */}
                    </div>
                    <div className="space-y-4">
                        <Label className="font-semibold">Position Name</Label>
                        {/* <InputField control={}/> */}
                    </div>
                    <div className="w-full flex justify-end gap-2">
                        <Button type="button" onClick={() => setOpen(false)} variant={"outline"} className="px-6 h-12 rounded-2xl">Cancel</Button>
                        <Button type="submit" variant={"addData"} className={`px-6 h-12 rounded-2xl`}>Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
