const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Rutas principales para los usuarios
router
    .route('/')
    .get(usersController.getAllUsers)  // Obtener todos los usuarios
    .post(usersController.createUser)  // Crear un nuevo usuario
    .patch(usersController.updateUser); // Actualizar un usuario

// Rutas específicas para descontar días feriados, administrativos y agregar horas compensatorias
router
    .patch('/deduct-holiday', usersController.deductHoliday)  // Descontar días feriados
    .patch('/deduct-administrative-days', usersController.deductAdministrativeDays)  // Descontar días administrativos
    .patch('/add-compensatory-hours', usersController.addCompensatoryHours);  // Agregar horas compensatorias

router
    .delete('/', usersController.deleteUser);  // Eliminar un usuario


module.exports = router;
