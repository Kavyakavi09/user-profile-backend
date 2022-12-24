import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema(
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
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      trim: true,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    city: String,
    street: String,
    houseNumber: String,
    state: String,
    pincode: Number,
    country: String,

    creator: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('UserProfile', UserProfileSchema);
