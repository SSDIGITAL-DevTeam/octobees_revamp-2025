// import { FormModal } from "../Modal/FormModal"

export default function WhatsappButton() {
  const waSVG =
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 "
      viewBox="0 0 32 32"
      fill="#FFFFFF"
    >
      <path d="M16.003 2.998c-7.285 0-13.19 5.905-13.19 13.19 0 2.325.607 4.597 1.76 6.592L2 30l7.385-2.558a13.135 13.135 0 006.618 1.73h.001c7.283 0 13.188-5.905 13.188-13.19 0-3.522-1.372-6.833-3.863-9.326A13.153 13.153 0 0016.003 2.998zm.001 23.961h-.001a11.13 11.13 0 01-5.67-1.557l-.406-.24-4.381 1.518 1.49-4.267-.266-.438a11.118 11.118 0 01-1.703-5.88c0-6.14 5-11.14 11.191-11.14 2.98 0 5.779 1.16 7.88 3.262a11.064 11.064 0 013.262 7.878c0 6.14-5.002 11.144-11.206 11.144zm6.126-8.387c-.336-.168-1.996-.984-2.307-1.096-.31-.112-.536-.168-.762.169s-.874 1.096-1.072 1.32c-.197.224-.395.252-.731.084-.336-.169-1.419-.522-2.703-1.667-1-0.893-1.674-1.994-1.87-2.33-.197-.336-.021-.518.148-.685.152-.151.336-.393.504-.589.168-.196.224-.337.336-.561.112-.224.056-.42-.028-.589-.084-.168-.762-1.841-1.043-2.52-.276-.665-.559-.576-.762-.586l-.649-.012c-.224 0-.589.084-.896.42s-1.176 1.148-1.176 2.793 1.206 3.239 1.374 3.463c.168.224 2.373 3.628 5.745 5.086.803.346 1.427.553 1.914.707.805.256 1.539.22 2.118.133.646-.096 1.996-.816 2.278-1.603.28-.785.28-1.457.196-1.603-.084-.14-.308-.224-.644-.393z" />
    </svg>

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.toString() || ""
  const message = encodeURIComponent("Hi! I'd like to learn more about your AI-powered CRM system. How can it help my business grow?")
  const url = `https://api.whatsapp.com/send/?phone=${encodeURIComponent(waNumber)}&text=${message}&type=phone_number&app_absent=0`;


  return (
    // <FormModal>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[99] rounded-full p-4 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
    >
      {waSVG}
    </a>

    // </FormModal>
  )
}