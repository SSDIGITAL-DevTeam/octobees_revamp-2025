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
import { axiosInstance } from "@/lib/axios"
import { failedToast, successToast } from "@/utils/toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import InputField from "../form/InputField"
import { Form } from "@/components/ui/form"
import { useSearchParams } from "next/navigation"

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
    const searchParams = useSearchParams();
    const [query] = useState<string>(searchParams.get("id") || "");

    const submitChangePassword = handleSubmit(async (value) => {
        try {
            await axiosInstance.patch(`/user/${query}`, {
                password: value.password,
                newPassword: value.newPassword
            })
            successToast("Password has been changed")
        } catch (error:any) {
            failedToast(error.response?.data?.error || error.response?.statusText || "failed to change password")
        } finally {
            reset()
            setOpen(false)
            refetch(prev => !prev)
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
                <Form {...form}>
                    <form onSubmit={submitChangePassword} className="space-y-6">
                        <InputField type="password" control={control} label="Current Password" name="password" />
                        <InputField type="password" control={control} label="New Password" name="newPassword" />
                        <InputField type="password" control={control} label="Confirm New Password" name="confirmNewPassword" />
                        <div className="w-full flex justify-end gap-2">
                            <Button type="button" onClick={() => setOpen(false)} variant={"outline"} className="px-6 h-12 rounded-2xl">Cancel</Button>
                            <Button type="submit" variant={"addData"} className={`px-6 h-12 rounded-2xl`}>Save</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
