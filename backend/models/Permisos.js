const mongoose = require('mongoose');

const PermisoSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: true,
        ref: 'User'
    },
    permisos: [{
        tipoPermiso: { type: String, required: true },
        estado: { type: String, required: true },
        fechaSolicitud: { type: Date, required: true },
        fechaInicio: { type: Date, required: true },
        fechaTermino: { type: Date, default: null },
        nDias: { type: Number, default: 0 },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Permisos', PermisoSchema);
