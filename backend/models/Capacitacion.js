const mongoose = require('mongoose');

const CapacitacionSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: true,
        ref: 'User'
    },
    capacitaciones: [{
        nombreCapacitacion: { type: String, required: true },
        horasRealizadas: { type: Number, default: 0 },
        nota:  { type: Number, default: 0 },
        PesoRelativo:{ type: String, required: true },
    
    }],
}, { timestamps: true });

module.exports = mongoose.model('Capacitaciones', CapacitacionSchema);
