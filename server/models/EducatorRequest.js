import mongoose from "mongoose";

const educatorRequestSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestMessage: {
        type: String,
        default: ''
    },
    adminResponse: {
        type: String,
        default: ''
    },
    reviewedBy: {
        type: String,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const EducatorRequest = mongoose.model('EducatorRequest', educatorRequestSchema);

export default EducatorRequest;