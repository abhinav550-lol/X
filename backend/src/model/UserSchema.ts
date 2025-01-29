import { model, Schema, Document, Types } from "mongoose";

interface UserInterface extends Document {
  name: string;
  userHandle: string;
  profilePic?: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  auth: {
    signInType: "Google" | "Session";
    sessionInfo?: {
      password: string;
    };
    googleInfo?: {
      googleId: string;
    };
  };
}

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
      signInType: {
        type: String,
        enum: ["Google", "Session"],
        required: true,
      },
      sessionInfo: {
        password: {
          type: String,
          required: function (this: any) {
            return this.signInType === "Session";
          },
        },
      },
      googleInfo: {
        googleId: {
          type: String,
          required: function (this: any) {
            return this.signInType === "Google";
          },
        },
      },
    },
  },
  { timestamps: true }
);

export default model<UserInterface>("User", userSchema);
