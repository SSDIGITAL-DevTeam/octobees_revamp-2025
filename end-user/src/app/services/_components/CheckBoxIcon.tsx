import Image from "next/image"
import CheckboxIcon from "@/assets/services/svg/checkbox.svg"

export default function CheckBoxIcon(): JSX.Element {
    return (
        <Image src={CheckboxIcon.src} alt="checkbox" width={1920} height={1080} className="w-5 h-5" />
    )
}