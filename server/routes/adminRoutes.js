import express from 'express';
import { getEducatorRequests, reviewEducatorRequest, getAllEducators, getAdminDashboard } from '../controllers/adminController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const adminRouter = express.Router();

// Get admin dashboard data
adminRouter.get('/dashboard', protectAdmin, getAdminDashboard);

// Get all educator requests
adminRouter.get('/educator-requests', protectAdmin, getEducatorRequests);

// Approve or reject educator request
adminRouter.post('/review-educator-request', protectAdmin, reviewEducatorRequest);

// Get all educators
adminRouter.get('/educators', protectAdmin, getAllEducators);

export default adminRouter;