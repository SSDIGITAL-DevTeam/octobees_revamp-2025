import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../../drizzle/db.js';
import { trainingContent } from '../../drizzle/schema.js';
import { eq, asc } from 'drizzle-orm';
import logger from '../../utils/logger.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const trainingUploadDir = path.resolve(__dirname, '../../upload/training');

if (!fs.existsSync(trainingUploadDir)) {
  fs.mkdirSync(trainingUploadDir, { recursive: true });
}

// Configure multer for PDF storage
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(trainingUploadDir)) {
      fs.mkdirSync(trainingUploadDir, { recursive: true });
    }
    cb(null, trainingUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'training-' + uniqueSuffix + ext);
  },
});

const pdfUpload = multer({
  storage: pdfStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Get all training content
router.get('/training-content', async (req, res) => {
  try {
    const content = await db
      .select()
      .from(trainingContent)
      .where(eq(trainingContent.isActive, true))
      .orderBy(asc(trainingContent.orderIndex));
    
    res.json({ status: 'success', data: content });
  } catch (error) {
    logger.error('Get training content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single training content
router.get('/training-content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [content] = await db
      .select()
      .from(trainingContent)
      .where(eq(trainingContent.id, id))
      .limit(1);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json({ status: 'success', data: content });
  } catch (error) {
    logger.error('Get training content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create training content
router.post('/training-content', async (req, res) => {
  try {
    const { title, description, contentType, contentValue, orderIndex } = req.body;
    
    if (!title || !contentType || !contentValue) {
      return res.status(400).json({ error: 'Title, contentType, and contentValue are required' });
    }
    
    const id = crypto.randomUUID();
    const [newContentId] = await db
      .insert(trainingContent)
      .values({
        id,
        title,
        description,
        contentType,
        contentValue,
        orderIndex: orderIndex || 0,
        isActive: true,
      })
      .$returningId();
    
    const [createdContent] = await db
      .select()
      .from(trainingContent)
      .where(eq(trainingContent.id, id))
      .limit(1);

    res.json({ status: 'success', data: createdContent });
  } catch (error) {
    logger.error('Create training content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update training content
router.put('/training-content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, contentType, contentValue, orderIndex, isActive } = req.body;
    
    await db
      .update(trainingContent)
      .set({
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(contentType && { contentType }),
        ...(contentValue !== undefined && { contentValue }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(trainingContent.id, id));
    
    const [updatedContent] = await db
      .select()
      .from(trainingContent)
      .where(eq(trainingContent.id, id))
      .limit(1);

    res.json({ status: 'success', data: updatedContent });
  } catch (error) {
    logger.error('Update training content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete training content (soft delete)
router.delete('/training-content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db
      .update(trainingContent)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(trainingContent.id, id));
    
    res.json({ status: 'success', data: { id } });
  } catch (error) {
    logger.error('Delete training content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reorder training content
router.post('/training-content/reorder', async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, orderIndex }
    
    for (const { id, orderIndex } of orders) {
      await db
        .update(trainingContent)
        .set({ orderIndex, updatedAt: new Date() })
        .where(eq(trainingContent.id, id));
    }
    
    res.json({ status: 'success', data: { message: 'Reordered successfully' } });
  } catch (error) {
    logger.error('Reorder training content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload PDF file
router.post('/training-content/upload-pdf', pdfUpload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const fileUrl = `/uploads/training/${req.file.filename}`;
    
    res.json({ 
      status: 'success', 
      data: { 
        url: fileUrl,
        filename: req.file.filename 
      } 
    });
  } catch (error) {
    logger.error('Upload PDF error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }

  if (error) {
    logger.error('Training content route error:', error);
    return res.status(400).json({ error: error.message || 'Training content request failed' });
  }

  return next();
});

export default router;
