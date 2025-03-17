
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
        const { rutAdmin, rutmodi, tipoPermiso, nDias, permisoId } = permisoData;
        console.log(rutAdmin)


        // Buscar al usuario administrador
        const adminUser = await User.findOne({ rut: rutAdmin });
        if (!adminUser) {
            return { error: `Usuario administrador con RUT: ${rutAdmin} no encontrado`, status: 404 };
        }

        // Verificar permisos del administrador
        if (!adminUser.permissions.includes("eliminar")) {
            return { error: "Permisos no autorizados", status: 403 };
        }

        // Buscar usuario al que se le eliminará el permiso
        const targetUser = await User.findOne({rut: rutmodi });
        if (!targetUser) {
            return { error: `Usuario con RUT: ${rutmodi} no encontrado`, status: 404 };
        }

        // Buscar los permisos del usuario
        let permisos = await Permiso.findOne({rut: rutmodi });
        if (!permisos) {
            return { error: `No se encontraron permisos para el usuario con RUT: ${rutmodi}`, status: 404 };
        }

        // Buscar el permiso a eliminar
        const permisoIndex = permisos.permisos.findIndex(p => p._id.toString() === permisoId);
        if (permisoIndex === -1) {
            return { error: "Permiso no encontrado", status: 404 };
        }

        // Convertir nDias a número
        const dias = Number(nDias);
        if (isNaN(dias)) {
            return { error: "El número de días en el permiso no es válido", status: 400 };
        }

        const tipoPermisoNormalizado = tipoPermiso.trim().toLowerCase();

        if (tipoPermisoNormalizado === "día administrativo"|| tipoPermisoNormalizado === "día adm.") {
            targetUser.diasAdministrativos += dias;
        } else if (tipoPermisoNormalizado === "feriado legal" || tipoPermisoNormalizado === "feriado") {
            targetUser.feriadoLegal += dias;
        } else if (tipoPermisoNormalizado === "horas compensatorias") {
            targetUser.horasCompensatorias -= dias;
        } else {
            return { error: "Tipo de permiso no válido", status: 400 };
        }
        

        // Guardar los cambios en el usuario
        await targetUser.save();

        // Eliminar el permiso de la lista de permisos
        permisos.permisos.splice(permisoIndex, 1);

        // Guardar los cambios en la colección de permisos
        await permisos.save();

        return { success: true, message: "Permiso eliminado correctamente y días revertidos", user: targetUser };
    } catch (error) {
        console.error(error);
        return { error: "Error al eliminar el permiso", status: 500 };
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

