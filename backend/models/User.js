const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: true,
        unique: true
    },
    apellidos: {
        type: String,
        required: true
    },
    nombres: {
        type: String,
        required: true
    },
    tipoContrato: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    FeriadoLegal: {
        type: Number,
        default: 0
    },
    DiasAdministrativos: {
        type: Number,
        default: 0
    },
    HorasCompensatorias: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
    

    },
    password: {
        type: String,
        required: true
    },
    permissions: {
        type: [String], 
        default: ["ver"]  
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
