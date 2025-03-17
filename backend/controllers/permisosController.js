const { useState } = require('react');
const Permiso = require('../models/Permisos');
const User = require('../models/User');
async function agregarPermiso(permisoData, res) { 
    try {
        console.log("📩 Datos recibidos:", permisoData);

        const { rut, rutadmin, estado, tipoPermiso, fechaSolicitud, fechaInicio, fechaTermino, nDias } = permisoData;

        console.log(`🔍 Buscando usuario administrador con RUT: ${rutadmin}...`);
        const adminUser = await User.findOne({ rut: rutadmin });

        if (!adminUser) {
            console.error(`❌ Usuario administrador con RUT ${rutadmin} no encontrado.`);
            return res.status(404).json({ message: `Usuario administrador con RUT: ${rutadmin} no encontrado` });
        }

        console.log("🔑 Verificando permisos del administrador...");
        if (!adminUser.permissions.includes("crear")) {
            console.error("⛔ Permisos insuficientes para crear permisos.");
            return res.status(403).json({ message: 'Permisos no autorizados' });
        }

        console.log(`🔍 Buscando usuario objetivo con RUT: ${rut}...`);
        const targetUser = await User.findOne({ rut }).populate("permisos");

        if (!targetUser) {
            console.error(`❌ Usuario con RUT ${rut} no encontrado.`);
            return res.status(404).json({ message: `Usuario con RUT: ${rut} no encontrado` });
        }

        console.log("🔢 Convirtiendo nDias a número...");
        const dias = Number(nDias);
        if (isNaN(dias)) {
            console.error("❌ nDias no es un número válido.");
            return res.status(400).json({ message: "El número de días no es válido" });
        }

        try {
            console.log("🔍 Buscando permisos previos de Feriado Legal...");
            const permisos = await Permiso.find({ rut });
        
            // Verificar si el usuario tiene algún permiso de Feriado Legal de 10 días o más
            let haTomadoFeriadoLargo = false;
            permisos.forEach(permisoDoc => {
                permisoDoc.permisos.forEach(p => {
                    if (p.tipoPermiso === "Feriado Legal" && p.nDias >= 10) {
                        haTomadoFeriadoLargo = true;
                    }
                });
            });
        
            if (haTomadoFeriadoLargo) {
                console.log("✅ El usuario ya ha tomado un Feriado Legal de 10 días o más. No se requiere restricción.");
            } else {
                if (targetUser.feriadoLegal === 10 && tipoPermiso === "Feriado Legal" && dias < 10) {
                    console.error("❌ Debes tomar un feriado de al menos 10 días cuando te quedan exactamente 10.");
                    return res.status(400).json({ message: "Debes tomar un feriado de al menos 10 días cuando te quedan exactamente 10." });
                }
        
                if (targetUser.feriadoLegal > 10 && tipoPermiso === "Feriado Legal" && dias < 10) {
                    console.error("❌ No puedes tomar menos de 10 días hasta que hayas tomado un feriado de al menos 10.");
                    return res.status(400).json({ message: "No puedes tomar esa cantidad de días dado que aún no has tomado tu feriado de 10 días (o más)." });
                }
        
                console.warn("⚠️ Recuerda que aún no has tomado un Feriado Legal de al menos 10 días.");
            }
        } catch (error) {
            console.error("🔥 Error al obtener los permisos por RUT:", error);
            return res.status(500).json({ message: "Error al obtener los permisos por RUT", error });
        }
        

        console.log(`📝 Validando tipo de permiso: ${tipoPermiso}...`);
        if (tipoPermiso === "Día Administrativo") {
            if (targetUser.diasAdministrativos - dias < 0) {
                console.error("❌ No hay suficientes días administrativos disponibles.");
                return res.status(400).json({ message: "Daría un resultado negativo, no se puede aceptar" });
            }
            targetUser.diasAdministrativos -= dias;
        } else if (tipoPermiso === "Feriado Legal") {
            if (targetUser.feriadoLegal - dias < 0) {
                console.error("❌ No hay suficientes días de feriado legal.");
                return res.status(400).json({ message: "Daría un resultado negativo, no se puede aceptar" });
            }
            targetUser.feriadoLegal -= dias;
        } else if (tipoPermiso === "Horas Compensatorias") {
            targetUser.horasCompensatorias += dias;
        } else {
            console.error("❌ Tipo de permiso no válido.");
            return res.status(400).json({ message: "Tipo de permiso no válido" });
        }

        console.log("💾 Guardando cambios en el usuario...");
        await targetUser.save();
        console.log("✅ Usuario actualizado con éxito.");

        console.log("🔍 Buscando permisos previos...");
        let permisos = await Permiso.findOne({ rut });

        if (!permisos) {
            console.log("🆕 No hay permisos previos, creando nuevo documento.");
            permisos = new Permiso({ rut, permisos: [] });
        }

        console.log("➕ Agregando nuevo permiso a la lista...");
        permisos.permisos.push(permisoData);

        console.log("💾 Guardando permisos en la base de datos...");
        await permisos.save();

        console.log("✅ Permiso agregado correctamente");

        return res.status(200).json({ message: "Permiso agregado correctamente", user: targetUser, permiso: permisoData });
    } catch (error) {
        console.error("🔥 Error en agregarPermiso:", error);
        return res.status(500).json({ message: 'Error al agregar el permiso', error: error.message });
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

