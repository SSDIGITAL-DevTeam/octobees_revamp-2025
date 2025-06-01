import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brands } from '@/constants/brands';

export default function SectionClientBrand(): JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {brands.map((brand, index) => (
        <div key={index} className="p-4 flex flex-col items-center justify-center">
          {brand.web ? (
            <Link href={brand.web} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <Image src={brand.logo} alt={`${brand.name} logo`} width={175} height={175} className="w-[175px]" priority={index < 4} quality={100} />
            </Link>
          ) : (
            <Image src={brand.logo} alt={`${brand.name} logo`} width={175} height={175} className="object-contain w-[175px] h-auto" priority={index < 4} quality={100} />
          )}
        </div>
      ))}
    </div>
  );
}
