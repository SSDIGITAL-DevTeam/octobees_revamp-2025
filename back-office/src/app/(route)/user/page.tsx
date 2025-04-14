
// app/user/page.tsx or page.js
'use client';

import dynamic from "next/dynamic";

const UserPage = dynamic(() => import('./UserPage'), {
  ssr: false,
});

export default UserPage;

