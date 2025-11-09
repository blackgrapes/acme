import mongoose from 'mongoose';

const EmailLimitSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true
  },
  dailyCount: {
    type: Number,
    default: 0
  },
  // ✅ FIXED: Proper array schema with validation
  userCounts: [{
    email: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Remove duplicate index to fix the warning
// EmailLimitSchema.index({ date: 1 }); // REMOVE THIS LINE - already handled by unique

export default mongoose.models.EmailLimit || mongoose.model('EmailLimit', EmailLimitSchema);