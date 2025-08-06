import React from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

const AdminNavbar = () => {
    const { user } = useUser();

    return (
        <div className="flex items-center justify-between h-14 px-4 md:px-8 border-b border-gray-500 py-2 bg-red-50">
            <Link to="/">
                <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
            </Link>
            <div className="flex items-center gap-5 text-gray-500 relative text-sm sm:text-base">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                    ADMIN
                </span>
                <p>Hi! {user?.fullName}</p>
                <UserButton />
            </div>
        </div>
    );
};

export default AdminNavbar;