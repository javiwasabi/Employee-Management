const Permiso = require('../models/Permisos');
const User = require('../models/User');
async function agregarPermiso(rut, permisoData) {
    try {

        const usuario = await User.findOne({ rut });

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
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

module.exports = { agregarPermiso, getPermisos, getPermisosPorRut };

