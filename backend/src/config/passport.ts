import passport from "passport";
import passportGoogle from "passport-google-oauth2";
import User from "../model/UserSchema";
import {userHandleGenerater} from "../utils/utils";
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
			}	
			return done(null , user._id);
		}catch(e){
			return done(e , null);
		}
	}
  )
);


passport.serializeUser((user : any , done) => {
	done(null , user._id);
});

passport.deserializeUser(async (id , done) => {
	try {
		const user = await User.findById(id)
		return done(null , user?._id as string);
	}catch(e){
		return done(e, null);
	}
});