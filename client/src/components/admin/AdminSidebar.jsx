import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminSidebar = () => {
    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: assets.home_icon },
        { name: 'Educator Requests', path: '/admin/educator-requests', icon: assets.person_tick_icon },
        { name: 'All Educators', path: '/admin/educators', icon: assets.my_course_icon },
    ];

    return (
        <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col bg-red-50">
            {menuItems.map((item) => (
                <NavLink
                    to={item.path}
                    key={item.name}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                        `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${
                            isActive
                                ? 'bg-red-100 border-r-[6px] border-red-500'
                                : 'hover:bg-red-50 border-r-[6px] border-transparent hover:border-red-100'
                        }`
                    }
                >
                    <img src={item.icon} alt="" className="w-6 h-6" />
                    <p className="md:block hidden text-center">{item.name}</p>
                </NavLink>
            ))}
        </div>
    );
};

export default AdminSidebar;