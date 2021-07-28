import User from '../models/user.js';

import isCompatible from './isCompatible.js';

const findListener = async (userId, filters) => {
  try {
    const listeners = await User.find({
      _id: { $ne: userId },
      'chat.isListener': true
    }, 'profile');

    const match = listeners.find(listener => isCompatible(listener, filters));

    return match;
  } catch (err) {
    console.log(err);
  }
};

export default findListener;