import userProfile from '../models/userProfile.js';
import userDetails from '../models/user.js';
import createError from '../utils/error.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await userProfile.findOne({ creator: req.userId });
    return res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const createProfile = async (req, res, next) => {
  const user = await userDetails.findById({ _id: req.userId });
  const { name, email, ...others } = req.body;

  const newProfile = new userProfile({
    ...others,
    name: user?.name,
    email: user?.email,
    creator: req.userId,
  });

  try {
    const existingUser = await userProfile.findOne({ email });

    if (existingUser) return next(createError(403, 'Profile already exist'));
    await newProfile.save();

    return res.status(201).json(newProfile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await userProfile.findById(req.params.id);
    if (!profile) return next(createError(404, 'Profile not found!'));
    if (req.userId === profile.creator) {
      const updatedProfile = await userProfile.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedProfile);
    } else {
      return next(createError(403, 'You can update only your Profile!'));
    }
  } catch (err) {
    next(err);
  }
};
