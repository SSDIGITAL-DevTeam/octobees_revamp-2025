export type List = {
    title: string,
    desc?: string,
    icons?: string,
}[]

export type Props = {
    list: List,
    height?: string,
    leading? :string
    width?: string,
    side?: "left" | "center" | "top",
}