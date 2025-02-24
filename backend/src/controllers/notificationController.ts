import { Types } from "mongoose";
import AppError from "../error/AppError";
import wrapAsyncErrors from "../error/wrapAsyncErrors";
import Notification, {
  NotificationInterface,
} from "../model/NotificationSchema";
import statusCodes from "../utils/statusCodes";
import User from "../model/UserSchema";

const notificationEnum =  ['liked' , 'retweeted' , 'commented' , 'posted'];

//get all notifications 
export const getAllNotifications = wrapAsyncErrors(async (req, res, next) => {
	const {userId} = req.params;
  
	const foundNotifications =	await Notification.find({ receiverId: userId });
  
	return res.status(statusCodes.OK).json({
	  success: true,
	  message: "Here are all the notifications of the user.",
	  notifications: foundNotifications
	});
  });


//issue a notification for a user
export const issueNotification = async (
  _for: string,
  senderId: Types.ObjectId,
  receiverId: Types.ObjectId,
  targetLink: string
) => {

  if(!notificationEnum.includes(_for)) return ;

  await Notification.create({
	senderId , 
	receiverId, 
	 _for ,
	 targetLink
  })
};

//mark notification seen
export const markNotificationSeen = wrapAsyncErrors(async (req, res, next) => {
  const { notificationId } = req.params;

  const foundNotification: NotificationInterface | null =
    await Notification.findById(notificationId);

  if (!foundNotification) {
    return next(
      new AppError(statusCodes.BAD_REQUEST, "Notification not found.")
    );
  }

  const {userId} = req.params;
  if (foundNotification.receiverId.toString() !== userId) {
    return next(
      new AppError(
        statusCodes.BAD_REQUEST,
        "Notification doesn't belong to you."
      )
    );
  }

  foundNotification.isRead = true;
  //@ts-ignore
  await foundNotification.save();

  return res.status(statusCodes.OK).json({
    success: true,
    message: "Read Notification.",
  });
});

//remove all notification
export const removeNotifications = wrapAsyncErrors(async (req, res, next) => {
  const {userId} = req.params;

  await Notification.deleteMany({ receiverId: userId });

  return res.status(statusCodes.OK).json({
    success: true,
    message: "Removed all notification.",
  });
});
