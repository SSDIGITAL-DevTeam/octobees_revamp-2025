export default function Loading({isLoading} : {isLoading: boolean}) {
    if(!isLoading) return null
    return(
        <div className="bg-black/30 fixed inset-0 flex justify-center items-center overflow-hidden z-[400]">
          <div className="loader scale-[50%] md:scale-[70%]">
            <div className="cell d-0"></div>
            <div className="cell d-1"></div>
            <div className="cell d-2"></div>
            <div className="cell d-1"></div>
            <div className="cell d-2"></div>
            <div className="cell d-2"></div>
            <div className="cell d-3"></div>
            <div className="cell d-3"></div>
            <div className="cell d-4"></div>
          </div>
        </div>
    )
}