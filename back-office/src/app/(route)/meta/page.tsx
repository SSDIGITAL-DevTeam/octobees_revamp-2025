
// app/user/page.tsx or page.js
'use client';

import dynamic from "next/dynamic";

const Page = dynamic(() => import('./MetagPage'), {
  ssr: false,
});

export default Page;

