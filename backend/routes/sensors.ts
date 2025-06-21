// Example usage in your routes file
import express from 'express';
import { getSensors, addSensor, deleteSensor } from '../controllers/sensors';

const router = express.Router();

router.get('/', getSensors);
router.post('/', addSensor);
router.delete('/:id', deleteSensor);

export default router;