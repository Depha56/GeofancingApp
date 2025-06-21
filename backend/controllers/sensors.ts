import { Request, Response } from 'express';
import Sensor from '../models/sensors';

// Get all sensor feeds, with optional query by collar_id, ordered by latest
export const getSensors = async (req: Request, res: Response) => {
    try {
        const { collar_id, limit = 50 } = req.query;
        const query: any = {};
        if (collar_id) query.collar_id = collar_id;

        const sensors = await Sensor.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit));
        res.json(sensors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch sensor feeds', details: err });
    }
};

// Add a new sensor feed
export const addSensor = async (req: Request, res: Response) => {
    try {
        const sensor = new Sensor(req.query);
        await sensor.save();
        res.status(201).json(sensor);
    } catch (err) {
        res.status(400).json({ error: 'Failed to add sensor feed', details: err });
    }
};

// Delete a sensor feed by ID
export const deleteSensor = async (req: Request, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await Sensor.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ error: 'Sensor feed not found' });
        }
        res.json({ message: 'Sensor feed deleted', id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete sensor feed', details: err });
    }
};