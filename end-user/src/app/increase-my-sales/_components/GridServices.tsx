
import AdsImage01 from '@/assets/increase/webp/ads1.webp'
import AdsImage02 from '@/assets/increase/webp/ads2.webp'
import AdsImage03 from '@/assets/increase/webp/ads3.webp'
import AdsImage04 from '@/assets/increase/webp/ads4.webp'
import AdsImage05 from '@/assets/increase/webp/ads5.webp'
import { Record } from 'iconsax-react'
import Image, { StaticImageData } from 'next/image'

const adsImages = [
    {
        image: AdsImage01,
        title: "🔍 Google Ads",
        desc: "No more guesswork. Let certified pros run your campaigns efficiently, transparently, and focused on real results."
    },
    {
        image: AdsImage02,
        title: "📱 Social Media Ads",
        desc: "Data meets creativity. We design social ads that don't just look good they drive clicks, engagement, and conversions."
    },
    {
        image: AdsImage03,
        title: "🔎 Search Engine Optimization",
        desc: "Be found when it matters. We help your website rank higher and attract the right traffic with on-page and content-driven SEO."
    },
    {
        image: AdsImage04,
        title: "🧠 Strategic Planning",
        desc: "Marketing that moves with intent. We build clear, data-backed strategies that align with your goals and make every step count."
    },
    {
        image: AdsImage05,
        title: "⚔️ Competitor Analysis",
        desc: "Outsmart the competition. We dissect what your competitors are doing  so you can do it better, faster, and smarter."
    }
]

type GridProps = {
    image: StaticImageData;
    title: string;
    desc: string;
    i: number;
}

// const Grid = ({ image, title, desc, i }: GridProps) => {
//     return (
//         <>
//             <Image
//                 src={image}
//                 width={1920}
//                 height={1080}
//                 alt={`ads-${i + 1}`}
//                 className='w-full'
//             />
//             <div className='absolute left-1/2 -translate-x-1/2 bottom-0 px-8 py-8 w-[90%] md:w-[80%] border-gray-300 border-[1px] bg-white rounded-xl shadow-sm hover:shadow-md space-y-3 transition-all duration-300'>
//                 <h1 className="text-lg md:text-2xl font-semibold !leading-[130%] text-primary">{title}</h1>
//                 <p className="text-sm md:text-lg !leading-[130%] text-gray-600">{desc}</p>
//             </div>
//         </>
//     )
// }

const Grid = ({ image, title, desc, i }: GridProps) => {
  return (
    <>
      <Image
        src={image}
        width={1920}
        height={1080}
        alt={`ads-${i + 1}`}
        className="w-full h-full md:object-contain object-cover rounded-xl md:rounded-none"
      />
      <div className="absolute md:-bottom-8 bottom-4 right-4 left-4 md:left-1/2 md:-translate-x-1/2 md:w-[80%] p-8 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md space-y-3 transition-all duration-300">
        <h1 className="text-lg md:text-2xl font-semibold leading-snug text-primary">
          {title}
        </h1>
        <p className="text-sm md:text-base lg:text-lg leading-snug text-gray-600">{desc}</p>
      </div>
    </>
  )
}


export default function GridServices() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {
                adsImages.map((data, i, arr) => {
                    const isLast = i === arr.length - 1;
                    const isOdd = arr.length % 2 !== 0;

                    if (isLast && isOdd) {
                        return (
                            <div key={i} className="md:col-span-2 flex justify-center">
                                <div className="md:w-1/2 relative h-[45vh] md:h-[50vh]">
                                    <Grid image={data.image} title={data.title} desc={data.desc} i={i} />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={i} className="w-full h-[45vh] md:h-[50vh] relative">
                            <Grid image={data.image} title={data.title} desc={data.desc} i={i} />
                        </div>
                    );
                })
            }
        </div>
    )
}