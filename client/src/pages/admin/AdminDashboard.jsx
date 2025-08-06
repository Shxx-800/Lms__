import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const AdminDashboard = () => {
    const { backendUrl, getToken } = useContext(AppContext);
    const [dashboardData, setDashboardData] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setDashboardData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return dashboardData ? (
        <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
            <div className="space-y-5 w-full">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                
                <div className="flex flex-wrap gap-5 items-center">
                    <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xl">📋</span>
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-gray-600">{dashboardData.totalRequests}</p>
                            <p className="text-base text-gray-500">Total Requests</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shadow-card border border-yellow-500 p-4 w-56 rounded-md">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 font-bold text-xl">⏳</span>
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-gray-600">{dashboardData.pendingRequests}</p>
                            <p className="text-base text-gray-500">Pending Requests</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shadow-card border border-green-500 p-4 w-56 rounded-md">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-xl">✅</span>
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-gray-600">{dashboardData.approvedRequests}</p>
                            <p className="text-base text-gray-500">Approved Requests</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shadow-card border border-red-500 p-4 w-56 rounded-md">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-bold text-xl">❌</span>
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-gray-600">{dashboardData.rejectedRequests}</p>
                            <p className="text-base text-gray-500">Rejected Requests</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="pb-4 text-lg font-medium">Recent Educator Requests</h2>
                    <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                        <table className="table-fixed md:table-auto w-full overflow-hidden">
                            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                                    <th className="px-4 py-3 font-semibold">User</th>
                                    <th className="px-4 py-3 font-semibold">Message</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-500">
                                {dashboardData.recentRequests.map((request, index) => (
                                    <tr key={index} className="border-b border-gray-500/20">
                                        <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                                        <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                                            <img
                                                src={request.userId.imageUrl}
                                                alt="Profile"
                                                className="w-9 h-9 rounded-full"
                                            />
                                            <div>
                                                <p className="truncate font-medium">{request.userId.name}</p>
                                                <p className="text-xs text-gray-400">{request.userId.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 truncate max-w-xs">
                                            {request.requestMessage || 'No message provided'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    ) : <Loading />;
};

export default AdminDashboard;