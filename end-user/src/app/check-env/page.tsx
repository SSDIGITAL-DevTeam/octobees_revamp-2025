import React from 'react'

function page() {
  return (
    <main className="">
        <header className="flex flex-col overflow-x-hidden py-[50px] lg:pt-[80px] bg-[#F2EDE6]">
            <div className="container flex flex-col items-center justify-center py-20 md:px-10">

                    {process.env.NEXT_PUBLIC_API_URL}
            </div>
        </header>
    </main>
   
  )
}

export default page