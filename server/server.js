import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded assets statically
app.use('/uploads', express.static(uploadsDir));

// Connect to local MongoDB
const MONGO_URI = 'mongodb://127.0.0.1:27017/coding-expo';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB successfully connected locally.');
  })
  .catch(err => {
    console.error('MongoDB local connection error:', err);
  });

// Project Mongoose Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  members: { type: [String], required: true },
  classSection: { type: String, required: true },
  description: { type: String, required: true },
  projectImage: { type: String, required: true },
  bannerChart: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// Configure Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // limit 10MB
});

// ================= API ENDPOINTS =================

// 1. Fetch all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student projects.' });
  }
});

// 2. Submit new project (with screenshots & banners)
app.post('/api/projects', upload.fields([
  { name: 'projectImage', maxCount: 1 },
  { name: 'bannerChart', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, members, classSection, description } = req.body;
    
    // Parse members array from request
    let membersList = [];
    if (typeof members === 'string') {
      try {
        membersList = JSON.parse(members);
      } catch (e) {
        membersList = members.split(',').map(m => m.trim());
      }
    } else if (Array.isArray(members)) {
      membersList = members;
    }

    const files = req.files;
    if (!files || !files.projectImage || !files.bannerChart) {
      return res.status(400).json({ error: 'Both Project Image and Banner/Chart uploads are required.' });
    }

    const projectImgPath = `/uploads/${files.projectImage[0].filename}`;
    const bannerChartPath = `/uploads/${files.bannerChart[0].filename}`;

    const newProject = new Project({
      title,
      members: membersList.filter(m => m.trim() !== ''),
      classSection,
      description,
      projectImage: projectImgPath,
      bannerChart: bannerChartPath
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Failed to save project submission.' });
  }
});

// Start Server listener
app.listen(PORT, () => {
  console.log(`CodingExpo Local Server is running on port ${PORT}`);
});
