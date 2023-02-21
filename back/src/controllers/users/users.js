// Imports
const { getWorkers, getWorker, deactivateUser, putEditUser, insertUser, getWorkerByEmail } = require('../../models/users/users')
const pool = require("../../config/db");


//! Gets all workers (Checked)
const getAllWorkers = async (req, res) => {
    try {
        const workers = await getWorkers()
        if (workers.length > 0) {
            return res.status(200).json(workers);
        } else {
            return res.status(500).json({ message: 'No hay empleados registrados' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer los trabajadores' });
    }
}

//! Gets worker info
const getWorkerById = async (req, res) => {
    try {
        const { id } = req.params
        const worker = await getWorker(id)
        if (worker.length > 0) {
            return res.status(200).json(worker);
        } else {
            return res.status(500).json({ message: 'No existe información sobre el trabajador' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer la información del trabajador' });
    }
}

//! Gets worker info by EMAIL.
const getWorkersByEmail = async (req, res) => {
    try {
        const { email } = req.params
        const worker = await getWorkerByEmail(email)
        if (worker.length > 0) {
            return res.status(200).json(worker);
        } else {
            return res.status(500).json({ message: 'No existe información sobre el trabajador' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer la información del trabajador' });
    }
}

//! Unsubscribes a user
const unsubscribeUser = async (req, res) => {
    try {
        const { id_user } = req.params
        const { assigner, notas, materials } = req.body
        const check = id_user && assigner && notas && materials && true
        if (check) {
            check && pool.getConnection((err, connection) => {
                connection.beginTransaction(err => {
                    connection.query(`UPDATE ga_orion.trabajador SET activo= 0 WHERE id= ?`, [id_user], (error, results) => {
                        if (error) { return connection.rollback(() => { throw error; }) }
                        if (results.affectedRows !== 0) {
                            if (materials.length > 0) {
                                let counter = 0;
                                let storage = 1;
                                materials.forEach(async ({ id }) => {
                                    connection.query(`UPDATE ga_orion.material_uniq SET id_trabajador= ? WHERE id= ?`, [storage, id], (error, results) => {
                                        if (error) { return connection.rollback(() => { throw error; }) }
                                        if (results.affectedRows !== 0) {
                                            connection.query(`INSERT INTO ga_orion.asignacion_material ( id_trabajador_origen, id_trabajador_destino, id_material_unico, notas, assigner ) 
                                            VALUES ( ?, ?, ?, ?, ? )
                                            `, [id_user, storage, id, notas, assigner], (error, results) => {
                                                if (err) { return connection.rollback(() => { throw err; }) }
                                                results.affectedRows !== 0 && counter++
                                                counter === materials.length && connection.commit((err) => {
                                                    if (err) { return connection.rollback(() => { throw err; }) }
                                                    return res.status(200).json({ message: '¡Trabajador dado de baja!' });
                                                });
                                            })
                                        }
                                    })
                                })
                            } else {
                                connection.commit((err) => {
                                    if (err) { return connection.rollback(() => { throw err; }) }
                                    return res.status(200).json({ message: '¡Trabajador dado de baja!' });
                                });
                            }
                        }
                    })
                })
            })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al deshabilitar el usuario' });
    }
}

//! Edits User.
const editUser = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, apellidos, id_posicion, id_departamento, id_edificio_planta, responsable, manager, email } = req.body
        const userData = await putEditUser(nombre, apellidos, id_posicion, id_departamento, id_edificio_planta, responsable, manager, email, id)
        if (userData.affectedRows !== 0) {
            return res.status(200).json({ message: 'Usuario editado correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al editar usuario' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al editar usuario' });
    }
}


//! Create user
const createUser = async (req, res) => {
    try {
        const { name, lastname, user_email, department, responsable, location, active, position, isManager } = req.body
        const allValuesFilled = (name && lastname && user_email && department && responsable && location && position && (isManager || !isManager)) ? true : false;
        if (!allValuesFilled) {
            res.status(500).json({ message: 'Error al crear el usuario' });
        } else {
            const newUser = await insertUser(name, lastname, position, department, location, responsable, active, user_email, isManager)
            if (newUser.insertId) {
                return res.status(200).json({ message: '¡Trabajador dado de alta!' });
            } else {
                return res.status(500).json({ message: 'Error al crear el usuario' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el usuario' });

    }
}

module.exports = { getAllWorkers, getWorkerById, getWorkersByEmail, unsubscribeUser, editUser, createUser }
