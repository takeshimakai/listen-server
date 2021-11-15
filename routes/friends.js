import express from 'express';

import friends from '../controllers/friends.js';

const router = express.Router();

// Get list of friends
router.get('/', friends.getFriends);

router.delete('/:userId', friends.deleteFriend);

// Send friend request
router.post('/requests', friends.sendRequest);

// Accept friend request
router.put('/requests', friends.acceptRequest);

// Delete friend request
router.delete('/requests', friends.deleteRequest);

export default router;