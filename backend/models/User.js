const mongoose = require("mongoose"); 
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
    feriadoLegal: {
        type: Number,
        default: 0
    },
    diasAdministrativos: {
        type: Number,
        default: 0
    },
    horasCompensatorias: {
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
    },
    permisos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Permiso' 
    }],
    capacitaciones: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Capacitacion' 
    }],
    role: { type: String, enum: ["admin", "supervisor", "usuario"], default: "usuario" },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);