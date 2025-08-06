import Course from "../models/Course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import stripe from "stripe"



// Get User Data
export const getUserData = async (req, res) => {
    try {

        const userId = req.auth.userId

        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Purchase Course 
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const { origin } = req.headers

        const userId = req.auth.userId

        if (!courseId) {
            return res.json({ success: false, message: 'Course ID is required' })
        }

        const courseData = await Course.findById(courseId)
        const userData = await User.findById(userId)

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' })
        }

        // Check if user is already enrolled
        if (userData.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'Already enrolled in this course' })
        }

        const finalPrice = courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100);

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
        }

        const newPurchase = await Purchase.create(purchaseData)

        console.log('Created purchase:', newPurchase._id, 'for user:', userId, 'course:', courseId);

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        const currency = (process.env.CURRENCY || 'USD').toLowerCase()

        // Creating line items to for Stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle,
                    description: `Course by ${courseData.educator}`
                },
                unit_amount: Math.round(newPurchase.amount * 100) // Convert to cents
            },
            quantity: 1
        }]

        const successUrl = `${origin}/loading/my-enrollments`;
        const cancelUrl = `${origin}/course/${courseId}`;

        const session = await stripeInstance.checkout.sessions.create({
            success_url: successUrl,
            cancel_url: cancelUrl,
            line_items: line_items,
            mode: 'payment',
            payment_method_types: ['card'],
            metadata: {
                purchaseId: newPurchase._id.toString(),
                userId: userId,
                courseId: courseId
            },
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes expiry
            customer_email: userData.email
        })

        console.log('Created Stripe session:', session.id, 'for purchase:', newPurchase._id);

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error('Error in purchaseCourse:', error);
        res.json({ success: false, message: error.message });
    }
}

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {

    try {

        const userId = req.auth.userId

        const userData = await User.findById(userId)
            .populate('enrolledCourses')

        res.json({ success: true, enrolledCourses: userData.enrolledCourses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {

    try {

        const userId = req.auth.userId

        const { courseId, lectureId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        if (progressData) {

            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' })
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        } else {

            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })

        }

        res.json({ success: true, message: 'Progress Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {

    try {

        const userId = req.auth.userId

        const { courseId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        res.json({ success: true, progressData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {

    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    // Validate inputs
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'InValid Details' });
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check is user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};