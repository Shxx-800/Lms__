import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";



// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {

    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    })

    // Getting Data from request body
    const { data, type } = req.body

    // Switch Cases for differernt Events
    switch (type) {
      case 'user.created': {

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          resume: ''
        }
        await User.create(userData)
        res.json({})
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }
      default:
        break;
    }

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// Stripe Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)


// Stripe Webhooks to Manage Payments Action
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  
  if (!sig) {
    console.error('No stripe signature found');
    return response.status(400).send('No signature');
  }

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log('Received webhook event:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { purchaseId } = session.metadata;

      console.log('Processing checkout.session.completed for purchase:', purchaseId);

      if (!purchaseId) {
        console.error('No purchaseId in session metadata');
        break;
      }

      try {
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error('Purchase not found:', purchaseId);
          break;
        }

        if (purchaseData.status === 'completed') {
          console.log('Purchase already completed:', purchaseId);
          break;
        }

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId.toString());

        if (!userData || !courseData) {
          console.error('User or Course not found');
          break;
        }

        console.log('Enrolling user:', userData.name, 'in course:', courseData.courseTitle);

        // Check if user is already enrolled
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        // Check if course is already in user's enrolled courses
        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        // Update purchase status
        purchaseData.status = 'completed';
        await purchaseData.save();

        console.log('Course enrollment completed successfully');
      } catch (error) {
        console.error('Error processing enrollment:', error);
      }
      break;
    }
    
    case 'checkout.session.expired':
    case 'payment_intent.payment_failed': {
      const session = event.data.object;
      let purchaseId;

      if (event.type === 'checkout.session.expired') {
        purchaseId = session.metadata.purchaseId;
      } else {
        try {
          const paymentIntent = event.data.object;
          const sessions = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntent.id,
          });
          purchaseId = sessions.data[0]?.metadata?.purchaseId;
        } catch (error) {
          console.error('Error getting session for failed payment:', error);
        }
      }

      if (purchaseId) {
        try {
          const purchaseData = await Purchase.findById(purchaseId);
          if (purchaseData) {
            purchaseData.status = 'failed';
            await purchaseData.save();
            console.log('Marked purchase as failed:', purchaseId);
          }
        } catch (error) {
          console.error('Error updating failed purchase:', error);
        }
      }
      break;
    }
    
    case 'payment_intent.succeeded': {
      console.log('Payment succeeded for payment intent:', event.data.object.id);
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
}