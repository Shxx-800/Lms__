import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const EducatorRequests = () => {
    const { backendUrl, getToken } = useContext(AppContext);
    const [requests, setRequests] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [adminResponse, setAdminResponse] = useState('');

    const fetchRequests = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/admin/educator-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setRequests(data.requests);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleReview = (request) => {
        setSelectedRequest(request);
        setAdminResponse('');
        setShowModal(true);
    };

    const submitReview = async (status) => {
        try {
            const token = await getToken();
            const { data } = await axios.post(`${backendUrl}/api/admin/review-educator-request`, {
                requestId: selectedRequest._id,
                status,
                adminResponse
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                fetchRequests(); // Refresh the list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return requests ? (
        <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
            <div className="w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Educator Requests</h1>
                
                <div className="flex flex-col items-center max-w-7xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="table-fixed md:table-auto w-full overflow-hidden">
                        <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                                <th className="px-4 py-3 font-semibold">User</th>
                                <th className="px-4 py-3 font-semibold">Request Message</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {requests.map((request, index) => (
                                <tr key={index} className="border-b border-gray-500/20">
                                    <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                                        <img
                                            src={request.userId.imageUrl}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="truncate font-medium">{request.userId.name}</p>
                                            <p className="text-xs text-gray-400">{request.userId.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs">
                                        <p className="truncate">{request.requestMessage || 'No message provided'}</p>
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
                                    <td className="px-4 py-3">
                                        {request.status === 'pending' ? (
                                            <button
                                                onClick={() => handleReview(request)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                            >
                                                Review
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Reviewed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Review Educator Request</h3>
                        
                        <div className="mb-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <img
                                    src={selectedRequest.userId.imageUrl}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <p className="font-medium">{selectedRequest.userId.name}</p>
                                    <p className="text-sm text-gray-500">{selectedRequest.userId.email}</p>
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700">Request Message:</p>
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    {selectedRequest.requestMessage || 'No message provided'}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Response (Optional):
                            </label>
                            <textarea
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                rows="3"
                                placeholder="Add a response message..."
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => submitReview('approved')}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => submitReview('rejected')}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : <Loading />;
};

export default EducatorRequests;