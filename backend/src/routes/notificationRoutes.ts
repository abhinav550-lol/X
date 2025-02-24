import express from 'express'
import { getAllNotifications, markNotificationSeen } from '../controllers/notificationController';
import { isLoggedIn } from '../controllers/authController';
const router = express.Router();

//get all noticiatioons
router.get('/:userId' ,isLoggedIn, getAllNotifications);

//mark a notification seen
router.post('/:userId/:notificationId' ,isLoggedIn, markNotificationSeen);

//delete all notification
router.delete('/:userId' , isLoggedIn, markNotificationSeen);

export default router; 