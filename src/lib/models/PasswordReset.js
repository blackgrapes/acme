import mongoose from 'mongoose';

const PasswordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '1h' } // Auto delete after 1 hour
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.PasswordReset || mongoose.model('PasswordReset', PasswordResetSchema);