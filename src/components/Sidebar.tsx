'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOutWithGoogle } from '@/lib/firebase/auth';
import { removeSession } from '@/server-action/auth_action';
import logo from '@/public/codecompass.png';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: string | null; // 'admin' or 'superadmin'
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, userRole }) => {
    const pathname = usePathname();
    const router = useRouter();
    
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await signOutWithGoogle();
            await removeSession();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isAdminManagementActive =
        pathname === '/admin/AddAdmin' ||
        pathname === '/admin/ListAdmin' ||
        pathname === '/admin/RemoveAdmin';

    const baseStyle = "flex items-center w-full p-1.5 text-xs transition rounded-md duration-200 hover:bg-gray-100";
    const activeStyle = "bg-purple-50 text-purple-600 font-medium";
    const inactiveStyle = "text-gray-600 hover:bg-gray-50";
    const subLinkBase = "block px-3 py-1 text-xs rounded transition duration-200";
    const subLinkActive = "bg-purple-50 text-purple-600 font-medium";
    const subLinkInactive = "text-gray-500 hover:bg-gray-50";

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <div 
                className={`fixed inset-y-0 left-0 w-48 bg-white shadow-lg transform transition-all duration-300 ease-in-out z-30 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static`}
            >
                <div className="flex flex-col h-full">
                    {/* Top Section */}
                    <div className="p-3 pt-3 pb-2">
                        <div className="flex items-center justify-center h-12 overflow-hidden">
                            <div className="relative w-5/6 h-full">
                                <Image src={logo} alt="Admin Dashboard" layout="fill" objectFit="contain" priority />
                            </div>
                        </div>
                    </div>

                    {/* Middle Section */}
                    <div className="flex-grow p-3 overflow-y-auto">
                        <div className="space-y-3">
                            <Link href="/" passHref>
                                <button className={`${baseStyle} ${pathname === '/' ? activeStyle : inactiveStyle}`}>
                                    Home
                                </button>
                            </Link>
                            <Link href="/s" passHref>
                                <button className={`${baseStyle} ${pathname === '/Scholarships' ? activeStyle : inactiveStyle}`}>
                                    Past Events
                                </button>
                            </Link>

                            {/* Admin Management Dropdown (Only for superadmin) */}
                            {userRole === 'superadmin' && (
                                <div>
                                    <button
                                        onClick={() => setShowAdminMenu(!showAdminMenu)}
                                        className={`${baseStyle} justify-between ${isAdminManagementActive ? activeStyle : inactiveStyle}`}
                                    >
                                        <span>Admin Management</span>
                                        <span className={`transform transition-transform duration-200 ${showAdminMenu ? 'rotate-180' : ''}`}>▼</span>
                                    </button>
                                    {showAdminMenu && (
                                        <div className="pl-4 mt-2 space-y-1 border-l-2 border-gray-200">
                                            <Link href="/admin/addAdmin" className={`${subLinkBase} ${pathname === '/addadmin' ? subLinkActive : subLinkInactive}`}>› Add New Admin</Link>
                                            <Link href="/admin/listAdmin" className={`${subLinkBase} ${pathname === '/listadmin' ? subLinkActive : subLinkInactive}`}>› List Admins</Link>
                                            <Link href="/admin/removeAdmin" className={`${subLinkBase} ${pathname === '/removeadmin' ? subLinkActive : subLinkInactive}`}>› Remove Admin</Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="p-6 pt-2 pb-3">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full p-3 transition rounded-xl border-2 duration-300 text-red-600 bg-red-100 hover:bg-red-300"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
