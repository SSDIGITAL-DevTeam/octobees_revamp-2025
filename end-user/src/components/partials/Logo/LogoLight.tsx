import { JSX } from 'react';
import Image from 'next/image';
import AssetLogo from '@/assets/logo/svg/asset-logo-white.svg';
import LogoSymbolLight from '@/assets/logo/webp/logo-octobees-white.webp'

export default function LogoLight({ className = 'w-32 lg:w-44' }: { className?: string }): JSX.Element {
  return (
    <figure className='flex items-center gap-4'>
      <Image src={LogoSymbolLight} alt="Asset Symbol Logo" quality={100}  className={`h-7 lg:h-10 w-fit`} />
      <Image src={AssetLogo} alt="Asset Logo" className={className} />
    </figure>
  );
}
