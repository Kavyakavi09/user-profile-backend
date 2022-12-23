import jwt from 'jsonwebtoken';
import createError from '../utils/error.js';

export const auth = (req, res, next) => {
  const token = req.headers.authorization || req.headers.Authorization;
  if (!token) return next(createError(401, 'Unauthorized'));

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return next(createError(403, 'Token is not valid!'));
    req.userId = user?.id;

    next();
  });
};

export default auth;
