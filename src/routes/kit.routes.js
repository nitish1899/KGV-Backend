// routes/kit.routes.js
import express from 'express';
import { createKit, getAllKits, getKitById, updateKitById, deleteKitById, getAddonItemsByKitName } from '../controllers/kit.controller.js';

const router = express.Router();

router.post('/create', createKit);
router.get('/get', getAllKits);
router.get('/getkit/:id', getKitById);
router.put('/:id', updateKitById);
router.delete('/:id', deleteKitById);

router.get('/search/:name', getAddonItemsByKitName);


export default router;
