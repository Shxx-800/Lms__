import { clerkClient } from '@clerk/express'
import EducatorRequest from '../models/EducatorRequest.js';
import User from '../models/User.js';

// Get all educator requests
export const getEducatorRequests = async (req, res) => {
    try {
        const requests = await EducatorRequest.find()
            .populate('userId', 'name email imageUrl')
            .sort({ createdAt: -1 });

        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Approve or reject educator request
export const reviewEducatorRequest = async (req, res) => {
    try {
        const { requestId, status, adminResponse } = req.body;
        const adminId = req.auth.userId;

        if (!['approved', 'rejected'].includes(status)) {
            return res.json({ success: false, message: 'Invalid status' });
        }

        const request = await EducatorRequest.findById(requestId);
        if (!request) {
            return res.json({ success: false, message: 'Request not found' });
        }

        // Update request status
        request.status = status;
        request.adminResponse = adminResponse || '';
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();
        await request.save();

        // If approved, update user role in Clerk
        if (status === 'approved') {
            await clerkClient.users.updateUserMetadata(request.userId, {
                publicMetadata: {
                    role: 'educator',
                },
            });
        }

        res.json({ 
            success: true, 
            message: `Request ${status} successfully` 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all educators
export const getAllEducators = async (req, res) => {
    try {
        // Get all users with educator role from approved requests
        const approvedRequests = await EducatorRequest.find({ status: 'approved' })
            .populate('userId', 'name email imageUrl createdAt');

        const educators = approvedRequests.map(request => ({
            ...request.userId.toObject(),
            approvedAt: request.reviewedAt
        }));

        res.json({ success: true, educators });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get admin dashboard data
export const getAdminDashboard = async (req, res) => {
    try {
        const totalRequests = await EducatorRequest.countDocuments();
        const pendingRequests = await EducatorRequest.countDocuments({ status: 'pending' });
        const approvedRequests = await EducatorRequest.countDocuments({ status: 'approved' });
        const rejectedRequests = await EducatorRequest.countDocuments({ status: 'rejected' });

        const recentRequests = await EducatorRequest.find()
            .populate('userId', 'name email imageUrl')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            dashboardData: {
                totalRequests,
                pendingRequests,
                approvedRequests,
                rejectedRequests,
                recentRequests
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};