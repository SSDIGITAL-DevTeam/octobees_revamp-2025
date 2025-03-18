import { JSX } from 'react';
import Image from 'next/image';
// import AssetLogo from '@/assets/logo/svg/asset-logo.svg';
import AssetLogo from '@/assets/logo/webp/logo-lengkap.webp';

export default function Logo({ className = 'w-40 lg:w-56' }: { className?: string }): JSX.Element {
  return (
    <figure>
      <Image src={AssetLogo} alt="Asset Logo" className={className} />
    </figure>
  );
}
