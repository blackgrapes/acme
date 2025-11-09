import mongoose from 'mongoose';

const FallbackRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  reason: {
    type: String,
    enum: ['EMAIL_SERVICE_DISABLED', 'EMAIL_SERVICE_FAILED', 'DAILY_LIMIT_EXCEEDED', 'USER_LIMIT_EXCEEDED'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  userExists: {
    type: Boolean,
    required: true
  },
  adminNotes: {
    type: String
  },
  completedAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.models.FallbackRequest || mongoose.model('FallbackRequest', FallbackRequestSchema);