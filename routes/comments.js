import express from 'express';

import comments from '../controllers/comments.js';

const router = express.Router();

router.get('/by-user', comments.getCommentsByUser);

router.get('/:postId', comments.getComments);

router.post('/:postId', comments.saveComment);

router.put('/:commentId', comments.editComment);

router.delete('/:commentId', comments.deleteComment);

router.put('/:commentId/relatability', comments.editRelatable);

export default router;