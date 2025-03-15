const { toHaveDescription } = require('@testing-library/jest-dom/dist/matchers');
const Permiso = require('../models/Permisos');
const User = require('../models/User');

async function agregarPermiso(permisoData) {
    try {
        const { rut, rutadmin, estado, tipoPermiso, fechaSolicitud, fechaInicio, fechaTermino, nDias } = permisoData;

        const adminUser = await User.findOne({ rut: rutadmin });
        if (!adminUser) {
            return res.status(404).json({ message: `Usuario administrador con RUT: ${rutadmin} no encontrado` });
        }


        if (!adminUser.permissions.includes("crear")) {
            return res.status(403).json({ message: 'Permisos no autorizados' });
        }

                // Convertir nDias a número
        const dias = Number(nDias);
        if (isNaN(dias)) {
            return res.status(400).json({ message: "El número de días no es válido" });
        }
        // Verificar y actualizar según tipoPermiso
        if (tipoPermiso === "Día Administrativo") {
            if (targetUser.diasAdministrativos - dias < 0) {
                return res.status(400).json({ message: "Daría un resultado negativo, no se puede aceptar" });
            }
            targetUser.diasAdministrativos -= dias;
        } else if (tipoPermiso === "Feriado Legal") {
            if (targetUser.feriadoLegal - dias < 0) {
                return res.status(400).json({ message: "Daría un resultado negativo, no se puede aceptar" });
            }
            targetUser.feriadoLegal -= dias;
        } else if (tipoPermiso === "Horas Compensatorias") {
            targetUser.horasCompensatorias += dias;
        } else {
            return res.status(400).json({ message: "Tipo de permiso no válido" });
}

        // Guardar cambios en la base de datos
        await targetUser.save();
        res.status(200).json({ message: "Permiso actualizado correctamente", user: targetUser });
                
          
          
        let permisos = await Permiso.findOne({ rut });

        if (!permisos) {
 
            permisos = new Permiso({ rut, permisos: [] });
        }

    
        permisos.permisos.push(permisoData);

    
        await permisos.save();

        return permisos;
    } catch (error) {
        console.error(error);
        throw new Error('Error al agregar el permiso');
    }
}

async function eliminarPermiso(permisoData) {
    try {
        const { rut, rutadmin, tipoPermiso, nDias, permisoId } = permisoData;

        // Buscar al usuario administrador
        const adminUser = await User.findOne({ rut: rutadmin });
        if (!adminUser) {
            return res.status(404).json({ message: `Usuario administrador con RUT: ${rutadmin} no encontrado` });
        }

        // Verificar si el administrador tiene permisos para eliminar
        if (!adminUser.permissions.includes("eliminar")) {
            return res.status(403).json({ message: 'Permisos no autorizados' });
        }

        // Buscar al usuario al que se le eliminará el permiso
        const targetUser = await User.findOne({ rut });
        if (!targetUser) {
            return res.status(404).json({ message: `Usuario con RUT: ${rut} no encontrado` });
        }

        // Buscar el permiso en la colección de permisos
        let permisos = await Permiso.findOne({ rut });
        if (!permisos) {
            return res.status(404).json({ message: `No se encontraron permisos para el usuario con RUT: ${rut}` });
        }

        // Buscar el permiso a eliminar
        const permisoIndex = permisos.permisos.findIndex(p => p._id.toString() === permisoId);
        if (permisoIndex === -1) {
            return res.status(404).json({ message: "Permiso no encontrado" });
        }

        // Convertir nDias a número
        const dias = Number(nDias);
        if (isNaN(dias)) {
            return res.status(400).json({ message: "El número de días en el permiso no es válido" });
        }

        // Revertir los días según el tipo de permiso eliminado
        if (tipoPermiso === "Día Administrativo") {
            targetUser.diasAdministrativos += dias;
        } else if (tipoPermiso === "Feriado Legal") {
            targetUser.feriadoLegal += dias;
        } else if (tipoPermiso === "Horas Compensatorias") {
            targetUser.horasCompensatorias -= dias;
        } else {
            return res.status(400).json({ message: "Tipo de permiso no válido" });
        }

        // Guardar los cambios en el usuario
        await targetUser.save();

        // Eliminar el permiso del usuario
        permisos.permisos.splice(permisoIndex, 1);

        // Guardar los cambios en la colección de permisos
        await permisos.save();

        return res.status(200).json({ message: "Permiso eliminado correctamente y días revertidos", user: targetUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el permiso' });
    }
}



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

module.exports = { agregarPermiso, getPermisos, getPermisosPorRut, eliminarPermiso };

