"use client"

import Loading from "@/components/layout/wrapper/Loading"
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
import { useState } from "react"

type Props = {
    children: React.ReactNode,
    setRefetch: (fetch: boolean) => void,
    refetch: boolean
    data?: {
        id: number,
        name: string,
        status: string
    },
    type?: string
}

export function DialogPosition({ children, data, refetch, setRefetch }: Props) {
    const [open, setOpen] = useState<boolean>(false)
    const [positionName, setPositionName] = useState<string>(data ? data.name : "")
    const [positionStatus, setPositionStatus] = useState<boolean>(data ? data.status === "Active" : false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const submitPosition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (positionName === "") return
        setIsLoading(true)
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
        } catch (error: any) {
            failedToast(
                error.response?.data?.error || error.response?.statusText || "Error adding position")
        } finally {
            setRefetch(!refetch)
            setOpen(false)
            setIsLoading(false)
        }
    }
    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[40vw] gap-8">
                <Loading isLoading={isLoading} />
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
