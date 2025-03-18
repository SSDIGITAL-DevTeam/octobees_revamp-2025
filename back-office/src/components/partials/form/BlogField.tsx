import dynamic from "next/dynamic";
import type { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

// Dynamic import tanpa SSR untuk TinyMCE
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor as unknown as React.ComponentType<any>), {
    ssr: false,
});

type Props = {
    control: Control<any>;
    name: string;
    label: string;
}
export default function BlogField({ control, name, label }: Props) {
    return (

        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel className="capitalize font-semibold mb-2 text-base">{name}</FormLabel>
                    <FormControl>
                        <Editor
                            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                            value={field.value}
                            onEditorChange={field.onChange}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: "link image code",
                                toolbar:
                                    "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
                            }}
                        /></FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
