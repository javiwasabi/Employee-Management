const Capacitacion = require('../models/Capacitacion');
const User = require('../models/User');


const getPermisos = async (req, res) => {
    try {
        const permisos = await Permiso.find(); 
        if (permisos.length === 0) {
            return res.status(404).json({ message: "No hay permisos registrados." });
        }
        res.status(200).json(permisos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los permisos", error });
    }
};


const getPermisosPorRut = async (req, res) => {
    const { rut } = req.params;
    try {
        const permisos = await Permiso.find({ rut });
        if (permisos.length === 0) {
            return res.status(404).json({ message: `No se encontraron permisos para el RUT: ${rut}` });
        }
        res.status(200).json(permisos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los permisos por RUT", error });
    }
};

async function agregarCapacitacion(rut, capacitacionData) {
    try {

        const usuario = await User.findOne({ rut });

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        let capacitaciones = await Capacitacion.findOne({ rut });

        if (!capacitaciones) {
 
            capacitaciones = new Capacitacion({ rut, capacitaciones: [] });
        }

    
        capacitaciones.capacitaciones.push(capacitacionData);

    
        await capacitaciones.save();

        return capacitaciones;
    } catch (error) {
        console.error(error);
        throw new Error('Error al agregar el capacitacion');
    }
}




const getCapacitaciones = async (req, res) => {
    try {
        const capacitaciones = await Capacitacion.find(); 
        if (capacitaciones.length === 0) {
            return res.status(404).json({ message: "No hay capacitaciones registrados." });
        }
        res.status(200).json(capacitaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los capacitaciones", error });
    }
};


const getCapacitacionPorRut = async (req, res) => {
    const { rut } = req.params;
    try {
        const capacitaciones = await Capacitacion.findOne({ rut: rut.trim() }); // Asegurar que es string
        if (!capacitaciones) {
            return res.status(404).json({ message: `No se encontraron capacitaciones para el RUT: ${rut}` });
        }
        res.status(200).json(capacitaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener capacitaciones por RUT", error });
    }
};


module.exports = { agregarCapacitacion, getCapacitaciones, getCapacitacionPorRut };

