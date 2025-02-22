// models/Description.ts
import mongoose, { Schema, Document } from "mongoose";

interface IDescription extends Document {
  userId: string;
  text: string;
}

const DescriptionSchema = new Schema<IDescription>({
  userId: { type: String, required: true, unique: true },
  text: { type: String, required: true },
});

export default mongoose.models.Description || mongoose.model<IDescription>("Description", DescriptionSchema);
