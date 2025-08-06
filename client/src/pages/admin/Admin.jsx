import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';

const Admin = () => {
    const { user } = useUser();
    const { navigate } = useContext(AppContext);

    // Check if user is admin
    if (!user || user.publicMetadata?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You don't have admin privileges to access this page.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-default min-h-screen bg-white">
            <AdminNavbar />
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Admin;