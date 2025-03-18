"use client"

import { useAuthStore } from '@/app/store/login';
import BreadCrumbComponents from '@/components/partials/breadcrumb/BreadCrumbComponents'
import { SidebarTrigger } from '@/components/ui/sidebar';
import { withAuth } from '@/hoc/withAuth';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'

const Header = (params: { title: string, label?: string }) => {
  const path = usePathname();
  const name = useAuthStore((state) => state.name);
  const role = useAuthStore((state) => state.role);
const logout = useAuthStore((state) => state.clearUser);
const router = useRouter()
const handleLogout = ()=>{
  sessionStorage.removeItem('token')
  logout();
  window.location.reload();
}
  return (
    <header className="w-full flex items-center justify-between py-6 text-slate-950 border-b-[1px] border-gray-300 shadow-sm">
      <div className='flex flex-col gap-3'>
        <h1 className='font-semibold sm:text-3xl text-lg'>{params.title}</h1>
        <BreadCrumbComponents data={`${params.label}/${path}`} />
      </div>
      <button className='flex items-end text-end gap-5'>
        <span onClick={handleLogout}>{name} <br/> <span className='text-red-800'>{role}</span></span>
        {
          name && <SidebarTrigger  />
        }
      </button>
    </header>
  )
}

export default withAuth(Header)