import { useAuthStore } from "@/app/store/login"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"


export function DeleteDialog({ children, deleteFunc }: { children: React.ReactNode, deleteFunc: () => void }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[465px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl max-w-72 !leading-[130%]">Are you sure you want to delete this item?</DialogTitle>
                    <DialogDescription className="md:text-sm">
                    You&apos;ll never be able to recover this item.
                    </DialogDescription>
                </DialogHeader>
                
                <DialogFooter>
                    <Button className="h-10 text-base bg-white text-black shadow-md border-[1px] hover:bg-gray-100" type="button" onClick={() => setOpen(!open)}>Cancel</Button>
                    <Button className="h-10 text-base bg-red-700 hover:bg-red-800" type="button" onClick={()=>{deleteFunc(); setOpen(!open)}}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
