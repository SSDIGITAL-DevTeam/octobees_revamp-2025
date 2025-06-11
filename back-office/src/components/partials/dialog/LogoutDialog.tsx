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


export function LogoutDialog({ children }: { children: string }) {
    const [open, setOpen] = useState(false);
    const logout = useAuthStore((state) => state.clearUser);

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        logout();
        window.location.reload();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-white bg-red-800 hover:bg-red-900" onClick={() => setOpen(!open)}>{children}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[465px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl max-w-72 !leading-[130%]">Are you sure you want to log out?</DialogTitle>
                    <DialogDescription>
                    You’ll need to sign in again to access your account.
                    </DialogDescription>
                </DialogHeader>
                
                <DialogFooter>
                    <Button className="h-10 text-base bg-white text-black shadow-md border-[1px] hover:bg-gray-100" type="button" onClick={() => setOpen(!open)}>Cancel</Button>
                    <Button className="h-10 text-base bg-red-700 hover:bg-red-800" type="button" onClick={handleLogout}>Logout</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
