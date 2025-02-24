import express from 'express'
import { isLoggedIn } from '../controllers/authController';
import {  createTweet, deleteTweet, editTweet, fetchAllLikedTweets, getAllTweets, getTweet, retweetTweet, tweetLike } from '../controllers/tweetController';
const router= express.Router();

//create tweet
router.post('/:userId/create' , isLoggedIn , createTweet)

//all tweets of a user
router.get('/:userId/all' , isLoggedIn, getAllTweets)

//view a tweet
router.get('/:tweetId' , isLoggedIn , getTweet)

//edit a tweet
router.patch('/:tweetId' , isLoggedIn , editTweet)

//delete a tweet
router.delete('/:tweetId' , isLoggedIn , deleteTweet)

//retweet a tweet
router.post('/:tweetId/retweet' , isLoggedIn , retweetTweet)

//like a tweet 
//unlike a tweet
router.post('/:tweetId/like' , isLoggedIn , tweetLike);

//fetch all liked tweets 
router.get('/:userId/liked-tweets' , isLoggedIn , fetchAllLikedTweets)

export default router;