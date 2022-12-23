import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
