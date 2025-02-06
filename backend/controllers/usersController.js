const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Permiso = require('../models/Permisos');
const Capacitacion = require('../models/Capacitacion');

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();

    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    users.sort((a, b) => {
  
        const lastNameA = a.apellidos ? a.apellidos.toLowerCase() : '';
        const lastNameB = b.apellidos ? b.apellidos.toLowerCase() : '';

        if (lastNameA < lastNameB) return -1; 
        if (lastNameA > lastNameB) return 1;  
        return 0;
    });

    res.json({
        totalUsers: users.length, 
        users: users
    });
});


const getUserByRut = asyncHandler(async (req, res) => {
    const { rut } = req.params;

    try {
        const user = await User.findOne({ rut });

        if (!user) {
            return res.status(404).json({ message: `No se encontró un usuario con el RUT: ${rut}` });
        }
        const permisos = await Permiso.find({ rut });
        const capacitaciones = await Capacitacion.find({ rut });


        res.status(200).json({
            user: user,
            permisos: permisos,
            capacitaciones: capacitaciones,
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener los datos del usuario y sus permisos", error });
    }
});

// @desc Create new users
// @route POST /users
// @access Private
const createUser = asyncHandler(async (req, res) => {
    const users = req.body; 

    if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ message: 'Please provide an array of users' });
    }

    const userPromises = users.map(async (user) => {
        const { rut, apellidos, nombres, tipoContrato, cargo, FeriadoLegal = 0, DiasAdministrativos = 0, HorasCompensatorias = 0, email, password } = user;

        if (!rut || !email || !password) {
            throw new Error('rut, email, and password are required');
        }

        const existingUser = await User.findOne({ rut }).exec();
        if (existingUser) {
            return existingUser;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ 
            rut, apellidos, nombres, tipoContrato, cargo, 
            FeriadoLegal, DiasAdministrativos, HorasCompensatorias, 
            email, password: hashedPassword 
        });

        return newUser;
    });

    try {
        const createdOrExistingUsers = await Promise.allSettled(userPromises);

        const successfulUsers = createdOrExistingUsers
            .filter(result => result.status === "fulfilled")
            .map(result => result.value);

        const failedUsers = createdOrExistingUsers
            .filter(result => result.status === "rejected")
            .map(result => ({ error: result.reason.message }));

        res.status(200).json({
            message: `${successfulUsers.length} user(s) processed`,
            successfulUsers,
            failedUsers
        });

    } catch (error) {
        res.status(500).json({ message: 'Error processing users', error: error.message });
    }
});

// @desc Delete a user by rut
// @route DELETE /users/:rut
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { ruts } = req.body;

    if (!ruts || ruts.length === 0) {
        return res.status(400).json({ message: 'At least one rut is required' });
    }

    try {
       
        const users = await User.find({ rut: { $in: ruts } });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found with the provided ruts' });
        }

        await User.deleteMany({ rut: { $in: ruts } });

        res.status(200).json({
            message: `${users.length} user(s) deleted successfully`,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting users', error: err.message });
    }
});


// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { rut, FeriadoLegal, DiasAdministrativos, HorasCompensatorias } = req.body;

    if (!rut) {
        return res.status(400).json({ message: 'rut is required' });
    }

    try {
        const user = await User.findOne({ rut }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (FeriadoLegal !== undefined) user.FeriadoLegal = FeriadoLegal;
        if (DiasAdministrativos !== undefined) user.DiasAdministrativos = DiasAdministrativos;
        if (HorasCompensatorias !== undefined) user.HorasCompensatorias = HorasCompensatorias;

        const updatedUser = await user.save();
        res.status(200).json({
            message: `User updated successfully`,
            user: updatedUser,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

// @desc Deduct holiday days
// @route PATCH /users/deduct-holiday
// @access Private
const deductHoliday = asyncHandler(async (req, res) => {
    const { rut, daysToDeduct } = req.body;

    if (!rut || !daysToDeduct) {
        return res.status(400).json({ message: 'rut and daysToDeduct are required' });
    }

    try {
        const user = await User.findOne({ rut }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.FeriadoLegal < daysToDeduct) {
            return res.status(400).json({ message: 'Insufficient holiday days' });
        }

        user.FeriadoLegal -= daysToDeduct;
        const updatedUser = await user.save();

        res.status(200).json({
            message: `Holiday days deducted successfully`,
            user: updatedUser,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error deducting holiday', error: err.message });
    }
});

// @desc Deduct administrative days
// @route PATCH /users/deduct-administrative-days
// @access Private
const deductAdministrativeDays = asyncHandler(async (req, res) => {
    const { rut, daysToDeduct } = req.body;

    if (!rut || !daysToDeduct) {
        return res.status(400).json({ message: 'rut and daysToDeduct are required' });
    }

    try {
        const user = await User.findOne({ rut }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.DiasAdministrativos < daysToDeduct) {
            return res.status(400).json({ message: 'Insufficient administrative days' });
        }

        user.DiasAdministrativos -= daysToDeduct;
        const updatedUser = await user.save();

        res.status(200).json({
            message: `Administrative days deducted successfully`,
            user: updatedUser,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error deducting administrative days', error: err.message });
    }
});

// @desc Add compensatory hours
// @route PATCH /users/add-compensatory-hours
// @access Private
const addCompensatoryHours = asyncHandler(async (req, res) => {
    const { rut, hoursToAdd } = req.body;

    if (!rut || !hoursToAdd) {
        return res.status(400).json({ message: 'rut and hoursToAdd are required' });
    }

    try {
        const user = await User.findOne({ rut }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.HorasCompensatorias += hoursToAdd;
        const updatedUser = await user.save();

        res.status(200).json({
            message: `Compensatory hours added successfully`,
            user: updatedUser,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error adding compensatory hours', error: err.message });
    }
});

const updateRolePermissions = asyncHandler(async (req, res) => {
    const { rut, permissions } = req.body;

    // Validar los datos entrantes
    if (!rut || !permissions) {
        return res.status(400).json({ message: "Datos inválidos" });
    }


    const user = await User.findOne({ rut }).exec();


    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    permissions.forEach(permission => {
        if (!user.permissions.includes(permission)) {
            user.permissions.push(permission); 
        }
    });

    await user.save();

  
    res.status(200).json({ message: "Permisos actualizados", permissions: user.permissions });
});
const removeRolePermissions = asyncHandler(async (req, res) => {
    const { rut, permissions } = req.body;

    if (!rut || !permissions) {
        return res.status(400).json({ message: "Datos inválidos" });
    }


    const user = await User.findOne({ rut }).exec();


    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }


    permissions.forEach(permission => {
        const index = user.permissions.indexOf(permission);
        if (index !== -1) {
            user.permissions.splice(index, 1);
        }
    });


    await user.save();

    res.status(200).json({ message: "Permisos eliminados correctamente", permissions: user.permissions });
});

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deductHoliday,
    deductAdministrativeDays,
    addCompensatoryHours,
    deleteUser,
    getUserByRut,
    updateRolePermissions,
    removeRolePermissions
};
