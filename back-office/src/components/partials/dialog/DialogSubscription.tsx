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
import { Subscription } from "@/constrant/payload"
import { axiosInstance } from "@/lib/axios"
import { failedToast, successToast } from "@/utils/toast"
import { format } from "date-fns"
import { useState } from "react"

type Props = {
    children: React.ReactNode,
    refetch: (refetch: boolean) => void;
    subscription: Subscription
}

export default function DialogSubscription({ children, subscription, refetch }: Props) {
    const [open, setOpen] = useState<boolean>(false)

    const ListSubscription = [
        {
            name: "Subscription Email",
            value: subscription?.email
        },
        {
            name: "Source",
            value: subscription?.source
        },
        {
            name: "Insight",
            value: subscription?.insight
        },
        {
            name: "Created At",
            value: format(new Date(subscription?.createdAt), "dd MMMM yyyy HH:mm")
        },
        {
            name: "Updated At",
            value: format(new Date(subscription?.updatedAt), "dd MMMM yyyy HH:mm")
        },
    ]
    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild className="cursor-pointer">
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[30vw] gap-8">
                <DialogHeader>
                    <DialogTitle>Subscription Details</DialogTitle>
                    <DialogDescription className="hidden">Subscription Details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {
                        ListSubscription.map((sub, index) => {
                            if (!sub.value) return null; // Skip if value is empty
                            return (
                                <div className="space-y-2" key={index}>
                                    <Label className="">{sub.name}:</Label>
                                    <p className="text-lg font-semibold">{sub.value}</p>
                                </div>
                            )
                        })
                    }
                    <div className="w-full flex justify-end gap-2">
                        <Button type="button" onClick={() => setOpen(false)} variant={"addData"} className={`px-6 h-12 rounded-2xl`}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
