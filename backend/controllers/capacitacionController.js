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
async function eliminarCapacitacion(capacitacionData) {
    try {
        const { rutAdmin, rutmodi, capacitacionId, nombreCapacitacion, horasRealizadas, nota, PesoRelativo } = capacitacionData;

        // Buscar al usuario administrador
        const adminUser = await User.findOne({ rut: rutAdmin });
        if (!adminUser) {
            return { error: `Usuario administrador con RUT: ${rutAdmin} no encontrado`, status: 404 };
        }

        // Verificar permisos del administrador
        if (!adminUser.permissions.includes("eliminar")) {
            return { error: "Permisos no autorizados", status: 403 };
        }

        // Buscar usuario al que se le eliminará la capacitación
        const targetUser = await User.findOne({ rut: rutmodi });
        if (!targetUser) {
            return { error: `Usuario con RUT: ${rutmodi} no encontrado`, status: 404 };
        }

        // Buscar las capacitaciones del usuario
        let capacitaciones = await Capacitacion.findOne({ rut: rutmodi });
        if (!capacitaciones) {
            return { error: `No se encontraron capacitaciones para el usuario con RUT: ${rutmodi}`, status: 404 };
        }

        // Buscar la capacitación a eliminar
        const capacitacionIndex = capacitaciones.capacitaciones.findIndex(c => c._id.toString() === capacitacionId);
        if (capacitacionIndex === -1) {
            return { error: "Capacitación no encontrada", status: 404 };
        }

        // Eliminar la capacitación de la lista
        capacitaciones.capacitaciones.splice(capacitacionIndex, 1);

        // Guardar los cambios en la colección de capacitaciones
        await capacitaciones.save();

        return { success: true, message: "Capacitación eliminada correctamente", user: targetUser };
    } catch (error) {
        console.error(error);
        return { error: "Error al eliminar la capacitación", status: 500 };
    }
}



module.exports = { agregarCapacitacion, getCapacitaciones, getCapacitacionPorRut, eliminarCapacitacion };

