const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


router
    .route('/')
    .get(usersController.getAllUsers)  
    .post(usersController.createUser) 
    .patch(usersController.updateUser);


router
    .patch('/deduct-holiday', usersController.deductHoliday) 
    .patch('/deduct-administrative-days', usersController.deductAdministrativeDays)  
    .patch('/add-compensatory-hours', usersController.addCompensatoryHours); 

router
    .delete('/', usersController.deleteUser);  


module.exports = router;
