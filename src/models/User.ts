// // import mongoose, { Schema, Document } from "mongoose";

// // export interface IUser extends Document {
// //   clerkId: string;
// //   description: string;
// // }

// // const UserSchema = new Schema<IUser>({
// //   clerkId: { type: String, required: true, unique: true },
// //   description: { type: String, default: "No description provided." },
// // });

// // export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// // export interface IUser extends Document {
// //   cler: string;
// //   description: string;
// // }


// import mongoose, { Schema, Document } from "mongoose";

// export interface IUser extends Document {
//     email: string;
//     image: string;
//   }
  

// const userSchema = new mongoose.Schema({
//     email:{
//         type: String,
//         required: true
//     },
//     image: String,
// })

// export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);



// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  description: string;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;