'use client'
import React from 'react'
import Image from 'next/image'
import { assets } from '@/Assets/assets'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const Sidebar = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            toast.success("Logged out successfully");
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <div className='flex flex-col bg-slate-100 min-h-screen'>
            <div className='px-2 sm:pl-14 py-3 border-b border-r border-black'>
                <Link href='/'>
                    <Image src={assets.logo} alt='' width={120} />
                </Link>
            </div>
            <div className='w-28 sm:w-80 flex-1 relative py-12 border-r border-black'>
                <div className='w-[80%] sm:w-[80%] absolute right-0 flex flex-col gap-5'>
                    <Link href={'/admin/addProduct'} className='flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.add_icon} alt='' width={28} />
                        <p className='hidden sm:block'>Add Blogs</p>
                    </Link>

                    <Link href={'/admin/blogList'} className='flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.blog_icon} alt='' width={28} />
                        <p className='hidden sm:block'>Blog Lists</p>
                    </Link>

                    <Link href={'/admin/subscription'} className='flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.email_icon} alt='' width={28} />
                        <p className='hidden sm:block'>Subscriptions</p>
                    </Link>

                    <button
                        onClick={handleLogout}
                        type="button"
                        className='flex items-center border border-black gap-3 font-medium px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 shadow-[-5px_5px_0px_#000000] mt-8 text-left cursor-pointer'
                    >
                        <span className='w-7 text-center font-bold text-lg'>&#x2192;</span>
                        <p className='hidden sm:block'>Logout</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
