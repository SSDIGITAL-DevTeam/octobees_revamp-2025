import Image from 'next/image'
import Header from './Header'

import FadeInWhenVisible from '@/components/partials/FramerMotion/FadeInWhenVisible'
import { Brand, brands } from '@/constants/homepage/brands'

export default function OurBrands() {
    return (
        <div className='lg:max-w-7xl w-full flex flex-col gap-10 lg:gap-16 lg:mx-auto px-5'>
            <Header title='our brand partners' className='md:max-w-6xl'/>
            <div className='flex flex-wrap w-full justify-center items-center gap-4 p-4 lg:gap-8 xl:gap-16'>
                {brands.map((brand: Brand, index: number) => {
                    return (
                        <FadeInWhenVisible
                            key={`brand-${index}`}
                            multiplier={index / 2}
                        >
                            <Image
                                priority
                                quality={100}
                                width={1920}
                                height={1080}
                                className='aspect-[18/9] w-32 md:w-56 object-contain'
                                loading='eager'
                                src={brand.logo}
                                alt={brand.name}
                            />
                        </FadeInWhenVisible>
                    )
                })}
            </div>
        </div>
    )
}