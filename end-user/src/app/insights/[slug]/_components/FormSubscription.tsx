import { DialogSuccessSubscription } from "@/components/layouts/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function FormSubscription({ slug }: { slug: string }): JSX.Element {
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
        const token = await executeRecaptcha('subscribesForm')
        try {
            const response = await axiosInstance.post("/subscription", { email, source: `insights-content`, insight: `${slug}`, token });
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={`lg:bg-white lg:mt-8 p-2 flex flex-col lg:flex-row items-center gap-2 lg:gap-3 lg:rounded-full w-full shadow-sm lg:w-[90%]`}>
                <Input
                    type="email"
                    required
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Enter your email address"
                    className="rounded-full px-4 text-sm lg:text-base border-none h-10 placeholder:text-sm placeholder:text-gray-600 w-full focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none" />
                <Button
                    type="submit"
                    disabled={isLoading}
                    className={`rounded-full w-full lg:w-fit lg:px-6 h-10 lg:h-full ${isLoading ? "pointer-events-none" : ""}`}>
                    {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
            </form>
            <DialogSuccessSubscription open={isOpen} setOpen={setIsOpen} />

        </>
    )
}