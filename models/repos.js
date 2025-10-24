// models/repos.js
import mongoose from 'mongoose';

const RepoSchema = new mongoose.Schema({
  id: { type: Number, index: true },
  name: String,
  full_name: String,
  private: Boolean,
  owner: Object,
  html_url: String,
  description: String,
  forks_count: Number,
  stargazers_count: Number,
  watchers_count: Number,
  language: String,
  created_at: Date,
  updated_at: Date,
  pushed_at: Date,
  raw: Object // full JSON if needed
}, {
  timestamps: true
});

export default mongoose.model('Repo', RepoSchema);

