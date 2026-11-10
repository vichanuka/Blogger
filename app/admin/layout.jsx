'use client'
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";
    const [authorized, setAuthorized] = useState(isLoginPage);
    const [loading, setLoading] = useState(!isLoginPage);

    useEffect(() => {
        if (isLoginPage) {
            setAuthorized(true);
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/auth/me');
                if (res.data?.authenticated) {
                    setAuthorized(true);
                } else {
                    router.push('/admin/login');
                }
            } catch {
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [pathname, isLoginPage, router]);

    if (isLoginPage) {
        return (
            <>
                <ToastContainer theme="dark" />
                {children}
            </>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <p className="text-gray-500 font-medium">Verifying admin session...</p>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <ToastContainer theme="dark" />
            <Sidebar />
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full py-3 max-h-[60px] px-6 sm:px-12 border-b border-black">
                    <h3 className="font-medium">Admin Panel</h3>
                    <Image src={assets.profile_icon} alt="profile" width={40} />
                </div>
                {children}
            </div>
        </div>
    );
}
