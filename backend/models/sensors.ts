import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const sensorSchema = new Schema({
    location: { type: String, required: false },
    accel_x: { type: Number, required: false },
    accel_y: { type: Number, required: false },
    accel_z: { type: Number, required: false },
    gyro_x: { type: Number, required: false },
    gyro_y: { type: Number, required: false },
    gyro_z: { type: Number, required: false },
    collar_id: { type: String, required: true }
}, {
    timestamps: true
});

const Sensor = model('Sensor', sensorSchema);

export default Sensor;