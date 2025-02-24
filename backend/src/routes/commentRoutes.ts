import express from 'express'
import { deleteComment, editComment, fetchTweetComments, postComment, replyToComment } from '../controllers/commentController';
const router=  express.Router();

// post a comment 
router.post('/:tweetId' , postComment);

//delete a comment 
router.delete('/:commentId' , deleteComment);

//edit a comment 
router.patch('/:commentId' , editComment);

// reply 
router.post('/userReply/:commentId' , replyToComment);

//fetch tweet comments
router.get('/:tweetId' , fetchTweetComments);

export default router;
