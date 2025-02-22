import mongoose from 'mongoose';

interface Description {
  userId: string;
  content: string;
}

const descriptionSchema = new mongoose.Schema<Description>({
  userId: String,
  content: String,
});

const DescriptionModel = mongoose.models.Description || mongoose.model<Description>('Description', descriptionSchema);

export default DescriptionModel;
