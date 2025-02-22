// models/UserProfile.ts
import mongoose from 'mongoose';

// Clear any existing model to prevent caching issues
if (mongoose.models.UserProfile) {
  delete mongoose.models.UserProfile;
}

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const InterestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  content: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  projectLink: String,
  createdAt: { type: Date, default: Date.now }
});

const SocialLinksSchema = new mongoose.Schema({
  github: String,
  email: String,
  linkedin: String,
  phone: String,
  location: String
});

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  image: String,
  skills: [SkillSchema],
  interests: [InterestSchema],
  posts: [PostSchema],
  projects: [ProjectSchema],
  socialLinks: { type: SocialLinksSchema, default: {} } // Added social links
});

export default mongoose.model('UserProfile', UserProfileSchema);