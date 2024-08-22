// routes/kit.routes.js
import express from 'express';
import { createKit, getAllKits, getKitById, updateKitById, deleteKitById } from '../controllers/kit.controller.js';

const router = express.Router();

router.post('/create', createKit);
router.get('/get', getAllKits);
router.get('/getkit/:id', getKitById);
router.put('/:id', updateKitById);
router.delete('/:id', deleteKitById);

export default router;
