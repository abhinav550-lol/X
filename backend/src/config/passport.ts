import passport from "passport";
import passportGoogle from "passport-google-oauth2";
import User, { UserInterface } from "../model/UserSchema";
import {userHandleGenerater} from "../utils/utils";
import { createUserFolder, uploadFile } from "../utils/fileHandling";
const GoogleStrategy = passportGoogle.Strategy;


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
	  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
	  callbackURL: `/auth/login/google`,
		
    }, 
    async (accessToken , refreshToken, profile , done) => {
		try{
			let user = await User.findOne({"auth.googleInfo.googleId" : profile.id});
			if(!user){
				let userHandle = "";
				let found = true;
	  
				while (found) {
				  userHandle = userHandleGenerater(profile.name.givenName);
				  let existingUser = await User.findOne({ userHandle });
				  if (existingUser) {
					found = true; 
				  } else {
					found = false; 
				  }	
				}

				

				const newUser = {
					name : profile.displayName, 
					userHandle : userHandle,
					auth : {
						signInType : "Google",
						googleInfo : {
							googleId : profile.id
						},
					}
				}


				user = await User.create(newUser);
				user.profilePic =  profile.picture;
				await user.save();

				createUserFolder(user._id.toString());
			}	


			return done(null , user._id.toString());
		}catch(e){
			return done(e , null);
		}
	}
  )
);


passport.serializeUser((user , done) => {
	done(null , user);
});

passport.deserializeUser(async (id , done) => {
	try {
		const user = await User.findById(id)
		if(!user) return done(null , null);
		return done(null , user?._id);
	}catch(e){
		return done(e, null);
	}
});