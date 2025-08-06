import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'
import EducatorRequest from '../models/EducatorRequest.js';

// Request to become educator
export const requestEducatorRole = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { requestMessage } = req.body;

        // Check if user already has a pending or approved request
        const existingRequest = await EducatorRequest.findOne({ 
            userId, 
            status: { $in: ['pending', 'approved'] } 
        });

        if (existingRequest) {
            if (existingRequest.status === 'approved') {
                return res.json({ success: false, message: 'You are already an educator' });
            }
            return res.json({ success: false, message: 'Your request is already pending approval' });
        }

        // Create new educator request
        await EducatorRequest.create({
            userId,
            requestMessage: requestMessage || ''
        });

        res.json({ success: true, message: 'Your request to become an educator has been submitted for admin approval' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Check educator request status
export const getEducatorRequestStatus = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const request = await EducatorRequest.findOne({ userId }).sort({ createdAt: -1 });

        if (!request) {
            return res.json({ success: true, status: 'none' });
        }

        res.json({ 
            success: true, 
            status: request.status,
            requestMessage: request.requestMessage,
            adminResponse: request.adminResponse,
            createdAt: request.createdAt,
            reviewedAt: request.reviewedAt
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// update role to educator (kept for backward compatibility but now requires admin approval)
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        // Check if user has approved educator request
        const approvedRequest = await EducatorRequest.findOne({ 
            userId, 
            status: 'approved' 
        });

        if (!approvedRequest) {
            return res.json({ success: false, message: 'You need admin approval to become an educator' });
        }

        // Update role in Clerk (this should already be done by admin, but double-check)
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        });

        res.json({ success: true, message: 'You can publish a course now' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add New Course
export const addCourse = async (req, res) => {

    try {

        const { courseData } = req.body

        const imageFile = req.file

        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = await JSON.parse(courseData)

        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {

        const educator = req.auth.userId

        const courses = await Course.find({ educator })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({ educator });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};