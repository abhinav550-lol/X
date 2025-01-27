import { model, Schema, Document, Types } from "mongoose";

interface Auth {
  signInType: "Google" | "Session";
  sessionInfo?: {
    password: string;
  };
  googleInfo?: {
    googleId: string;
  };
}

interface UserInterface extends Document {
  name: string;
  userHandle: string;
  profilePic?: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  auth: Auth;
}

const SessionInfoSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Please enter a password."],
    },
  },
  { _id: false }
);

const GoogleInfoSchema = new Schema(
  {
    googleId: {
      type: String,
      required: [true, "Please enter a Google ID."],
    },
  },
  { _id: false }
);

const AuthSchema = new Schema(
  {
    signInType: {
      type: String,
      enum: ["Google", "Session"],
      required: true,
    },
    sessionInfo: {
      type: SessionInfoSchema,
      required: function (this: any) {
        return this.signInType === "Session";
      },
    },
    googleInfo: {
      type: GoogleInfoSchema,
      required: function (this: any) {
        return this.signInType === "Google";
      },
    },
  },
  { _id: false }
);

const userSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      maxlength: [50, "Name must not exceed 50 characters."],
    },
    userHandle: {
      type: String,
      required: [true, "User handle is required."],
      unique: true,
    },
    profilePic: {
      type: String,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    auth: {
      type: AuthSchema,
      required: true,
      select: true,
    },
  },
  { timestamps: true }
);

export default model<UserInterface>("User", userSchema);
