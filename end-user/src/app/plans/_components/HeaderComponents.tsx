import React from 'react'

type ParamsType = {
  plans: string,
  title: string,
  desc: string
}

const HeaderComponents = ({ plans, title, desc }: ParamsType): JSX.Element => {

  return (
    <header className="flex flex-col overflow-x-hidden pt-[160px] pb-[60px] lg:pt-[160px] lg:pb-[90px] bg-[#F7E6E7] min-h-[75vh] lg:min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center justify-center text-justify lg:text-center w-full gap-y-5 px-10">
        <div className="flex flex-col items-center justify-center text-center gap-y-5">
          <p className="font-body font-semibold text-secondary text-xs md:text-base tracking-wider">
            {plans &&
              <span>
                Octobees • Plans<span className="text-black">{" • "}{plans}</span>
              </span>
            }
          </p>
          <h1 className="font-heading font-medium text-dark text-4xl md:text-6xl w-full max-w-[45rem] !leading-[120%]">
            {title}
          </h1>
        </div>
        <p className="w-full max-w-[39rem] text-gray-600 text-center text-sm lg:text-lg !leading-[150%]">{desc}</p>
      </div>
    </header>
  )
}

export default HeaderComponents