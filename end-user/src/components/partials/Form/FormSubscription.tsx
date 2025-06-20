import { DialogSuccessSubscription } from "@/components/layouts/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";


export default function FormSubscription({ className, source, setOpen }: { className?: string, source: string, setOpen?: (open: boolean) => void; }): JSX.Element {
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { executeRecaptcha } = useGoogleReCaptcha()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() === "") return;
        setIsLoading(true);
        if (!executeRecaptcha) {
            throw new Error('reCAPTCHA is not available')
        }
        const token = await executeRecaptcha('subscribeForm')
        try {
            const response = await axiosInstance.post("/subscription", { email, source, token });
            if (response.status === 201) {
                setEmail("");
                setIsOpen(true);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit email. Please try again later.",
                variant: "danger"
            })
        }finally{
            // if(setOpen) setOpen(false);
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <form onSubmit={handleSubmit} className={`bg-white md:mt-8 p-[4px] md:p-1 flex items-center gap-2 md:gap-3 rounded-full w-full shadow-md md:w-[90%] ${className}`}>
                <Input
                    type="email"
                    required
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Enter your email address"
                    className="px-3 md:px-4 text-sm md:text-base border-none focus-visible:ring-0 h-fit placeholder:text-sm placeholder:text-gray-600 shadow-none" />
                <Button
                    type="submit" 
                    disabled={isLoading}
                    className={`rounded-full px-4 sm:px-6 h-full ${isLoading ? "pointer-events-none" : ""}`}>
                    {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
            </form>
            <DialogSuccessSubscription open={isOpen} setOpen={setIsOpen} />
        </>
    )
}