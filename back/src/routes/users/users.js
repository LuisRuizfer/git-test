//Imports
const route = require('express').Router();
const { getAllWorkers, getWorkerById, unsubscribeUser, editUser, getWorkersByEmail } = require('../../controllers/users/users');
const { createUser } = require('../../controllers/users/users');

//Routes
route.get('/api/users', getAllWorkers);
route.get('/api/users/:id', getWorkerById)                //! Gets worker info (Checked)
route.get('/api/users/data/:email', getWorkersByEmail)    //! Gets worker by Email (Checked)   
route.put('/api/user-cancel/:id_user', unsubscribeUser);  //! Unsubscribes user, returns their materials to storage and creates assignment logs  
// route.put('/api/tipos/:id', editTipo);     
// route.get('/api/tipos/:id', getTypeById);
route.post('/api/user', createUser)
route.put('/api/edit_user/:id', editUser)


module.exports = route;
