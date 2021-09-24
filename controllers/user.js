import expressValidator from 'express-validator';

import User from '../models/user.js';

const { body, validationResult } = expressValidator;

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId, 'profile').lean();

    // Hide info if current user is fetching other user's profile
    if (req.user.id !== user._id && user.profile.hidden) {
      let filtered = { _id: user._id };
      for (const key in user.profile) {
        if (!user.profile.hidden.includes(key) && key !== 'hidden') {
          filtered = {
            ...filtered,
            [key]: user.profile[key]
          }
        }
      }
      return res.status(200).json(filtered);
    }

    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

const saveUsername = [
  body('username')
  .notEmpty()
  .withMessage('Username is required')
  .custom(value => !/\s/.test(value))
  .withMessage('No spaces allowed in the username')
  .isAlphanumeric()
  .withMessage('Must contain only letters and numbers')
  .custom(value => {
    return User
      .findOne({ 'profile.username': value })
      .then(user => {
        if (user) {
          return Promise.reject('Username already in use');
        }
      })
  }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }

      await User.findByIdAndUpdate(req.user.id, { 'profile.username': req.body.username });

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
]

const saveProfile = [
  body('interests')
  .trim()
  .escape()
  .customSanitizer(value => value.toLowerCase().split(/\s*(?:,|$)\s*/)),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }

      const updated = await User.findByIdAndUpdate(
        req.user.id,
        {
          'profile.dob': req.body.dob,
          'profile.gender': req.body.gender,
          'profile.interests': req.body.interests,
          'profile.problemTopics': req.body.problemTopics,
          'profile.hidden': req.body.hidden
        },
        { new: true }
      );

      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }
];

const deleteUser = (req, res, next) => {
  User
  .findByIdAndDelete(req.user.id)
  .then(res.sendStatus(200))
  .catch(err => next(err));
};

export default {
  getProfile,
  saveUsername,
  saveProfile,
  deleteUser
};