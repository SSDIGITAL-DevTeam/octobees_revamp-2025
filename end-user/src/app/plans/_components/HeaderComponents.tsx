import React from 'react'

type ParamsType = {
  breadcrump: string,
  title: string,
  desc: string
}

const HeaderComponents = ({ breadcrump, title, desc }: ParamsType): JSX.Element => {

  const breadCrump = breadcrump.split(",", 3);

  return (
    <header className="flex flex-col overflow-x-hidden py-10 xl:pb-[40px] xl:pt-[100px] bg-[#F7E6E7]">
      <div className="container flex flex-col items-center justify-center pt-28 lg:pt-20 pb-10 md:px-10">
        <div className="flex flex-col w-full gap-y-10 items-center justify-center">
          <div className="flex flex-col text-center items-center justify-center gap-y-8 ">
            <div className="flex flex-col items-center justify-center text-center gap-y-5">
              <h2 className="font-body font-semibold text-secondary text-xs md:text-base tracking-wider">
                {breadCrump[0]} • {breadCrump[1]}<span className="text-black">• {breadCrump[2]}</span>
              </h2>
              <h1 className="font-heading font-medium text-dark text-4xl md:text-6xl w-full max-w-[45rem] !leading-[120%]">
                {title}
              </h1>
            </div>
            <p className="w-full max-w-[39rem] text-gray-600 text-center text-sm lg:text-lg !leading-[150%]">{desc}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponents