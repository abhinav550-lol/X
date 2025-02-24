import express from 'express';
import {editUser , fetchForYou, followUser , unfollowUser , getUserProfile , getFollowers , getFollowing} from '../controllers/userController'
import { isLoggedIn } from '../controllers/authController';
import { getAllMedia } from '../controllers/mediaController';
const router = express.Router();


//id is userHandle
//get user profile
router.get('/get/:id' , isLoggedIn , getUserProfile);

//edit profile
router.patch('/edit/:id' , isLoggedIn , editUser);

//follow  
router.post('/follow/:id' , isLoggedIn, followUser);

//unfollow 
router.post('/unfollow/:id' ,isLoggedIn , unfollowUser);

//getFollowers & Following
router.get('/followers/:id' , isLoggedIn , getFollowers);
router.get('/following/:id' , isLoggedIn , getFollowing);

//fetch 'for you' algo
router.get('/for-you/:id' , isLoggedIn ,fetchForYou); 

//all media 
router.get('/media/:id' , isLoggedIn ,getAllMedia); 

//get follow suggestions 
router.get('/follow-suggestions/:id')
export default router;
