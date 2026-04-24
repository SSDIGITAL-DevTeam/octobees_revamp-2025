import express from 'express';
import {
    create,
    update,
    getList,
    getById,
    currentOpenBatch,
    remove
} from './batch.controller.js';
import { sseHandler } from './batch-sse.js';

const router = express.Router();

// SSE endpoint for real-time batch status updates
router.get('/events', sseHandler);

// End-User route (just querying status)
router.get('/current', currentOpenBatch);

// Back-Office routes (CRUD)
router.post('/', create);
router.put('/:id', update); // Changed to PUT since update replaces fields
router.patch('/:id', update); // Kept for backwards compatibility
router.delete('/:id', remove);
router.get('/', getList);
router.get('/:id', getById);

export default router;
