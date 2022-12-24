import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userDetails from '../models/user.js';
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import createError from '../utils/error.js';

const securePassword = async (password) => {
  let salt = await bcrypt.genSalt(10);
  var hash = await bcrypt.hash(password, salt);
  return hash;
};

// signin
export const signup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    const existingUser = await userDetails.findOne({ email });
    if (existingUser) return next(createError(400, 'User Already exist'));

    if (password !== confirmPassword)
      return next(createError(400, "Passwords don't match"));

    const hashedPassword = await securePassword(password);

    await userDetails.create({
      email: email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    return res.status(201).json({
      message: 'successfully signed up',
    });
  } catch (error) {
    next(error);
  }
};

// signup

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userDetails.findOne({ email });

    if (!existingUser) return next(createError(401, 'Invalid Credentials'));

    let isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (isPasswordMatch) {
      let token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );

      const { password, ...others } = existingUser._doc;

      return res.status(200).json({
        message: 'successfully logged in',
        token: token,
        user: others,
      });
    } else {
      return next(createError(401, 'Wrong Credentials!'));
    }
  } catch (error) {
    next(error);
  }
};

// reset password mail
export const resetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'For Reset Password',
      text: 'Please click the link below and reset your password',
      html:
        '<p> Hi ' +
        name +
        ', Please click <a href="https://userprofily.netlify.app/#/reset/' +
        token +
        '"> here </a> to reset your password.The link will be expired in 15 minutes.</p>',
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Mail has been sent', info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// forget password
export const forgetPassword = async (req, res, next) => {
  try {
    const isUserExist = await userDetails.findOne({ email: req.body.email });
    if (isUserExist) {
      const randomString = randomstring.generate();
      let token_pass = jwt.sign(
        { name: isUserExist.name, id: isUserExist._id },
        randomString,
        {
          expiresIn: '15m',
        }
      );
      await userDetails.updateOne(
        { email: req.body.email },
        { $set: { token: token_pass } }
      );
      resetPasswordMail(isUserExist.name, isUserExist.email, token_pass);
      res.status(200).json({
        message: 'Please check your inbox of email and reset your password',
      });
    } else {
      return next(createError(401, 'Invalid Credentials'));
    }
  } catch (error) {
    next(error);
  }
};

// reset password
export const resetPassword = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      return next(createError(400, "Passwords don't match"));
    } else {
      const token = req.params.token;
      const tokenData = await userDetails.findOne({ token: token });
      if (tokenData) {
        const password = req.body.password;
        const newPassword = await securePassword(password);
        const userData = await userDetails.findByIdAndUpdate(
          { _id: tokenData._id },
          { $set: { password: newPassword, token: '' } },
          { new: true }
        );
        res.status(200).json({
          message: 'Your password reset successfully',
          data: userData,
        });
      } else {
        return next(createError(400, 'This link has been expired'));
      }
    }
  } catch (error) {
    next(error);
  }
};
