"use client"

import { Button } from "@/components/ui/button"
// import FormComponents from "@/components/layout/form/FormCategory"
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
import { Position } from "@/constrant/payload"
import { axiosInstance } from "@/lib/axios"
import { failedToast, successToast } from "@/utils/toast"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

type Props = {
    children: React.ReactNode,
    refetch: Dispatch<SetStateAction<boolean>>
    data?: {
        id: number,
        name: string,
        status: string
    },
    type?: string
}

export function DialogPosition({ children, data, refetch }: Props) {
    const [open, setOpen] = useState<boolean>(false)
    const [positionName, setPositionName] = useState<string>(data ? data.name : "")
    const [positionStatus, setPositionStatus] = useState<boolean>(data ? data.status === "Active" : false)

    const submitPosition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(positionName === "") return
        try {
            if (data) {
                await axiosInstance.put(`/position/${data.id}`, {
                    name: positionName,
                    status: positionStatus ? "Active" : "NonActive",
                })
                successToast("Position has been updated")
            } else {
                await axiosInstance.post("/position", {
                    name: positionName,
                })
                setPositionName("")
                setPositionStatus(false)
                successToast("Position has been added")
            }
        } catch (error) {
            failedToast("Failed to add position")
        } finally {
            refetch(prev => !prev)
            setOpen(false)
        }
    }
    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[40vw] gap-8">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Position" : "Add Position"}</DialogTitle>
                    <DialogDescription className="hidden">Category</DialogDescription>
                </DialogHeader>
                <form onSubmit={submitPosition} className="space-y-6">
                    <div className="space-y-4">
                        <Label className="font-semibold">Position Name</Label>
                        <Input onChange={(e) => setPositionName(e.target.value)} value={positionName} />
                    </div>
                    {
                        data &&
                        <div className="space-y-4 flex flex-col">
                            <Label className="font-semibold">Status</Label>
                            <Switch
                                checked={positionStatus}
                                onCheckedChange={setPositionStatus}
                            />
                        </div>
                    }
                    <div className="w-full flex justify-end gap-2">
                        <Button type="button" onClick={() => setOpen(false)} variant={"outline"} className="px-6 h-12 rounded-2xl">Cancel</Button>
                        <Button type="submit" variant={"addData"} className={`px-6 h-12 rounded-2xl ${data && "bg-[#E7BB53] hover:bg-[#d0a644] text-black"}`}>{data ? "Save Changes" : "Add Position"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
