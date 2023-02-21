//Imports
const { getUniqueMaterials, getWorkersMaterials, getUniqueMaterialsByType, getAllDataMaterials, getUniqueMaterialById, createMaterialUnique, getUniqueMaterialByGACode, insertExistingMaterialCode, getUniqueMaterialBySerial } = require('../../models/materiales/materials_unique')
const { newMaterialUnique } = require('../../models/materiales/materials_unique');
const { firstMaterialAssignment, createAssignment } = require("../../models/materiales/material_assignment");

const pool = require("../../config/db");
const { isPC } = require('../../utils/utils')

//! Gets all materials unique (Checked)
const getAllMaterialsUnique = async (req, res) => {
    try {
        const uniqueMaterials = await getUniqueMaterials()
        if (uniqueMaterials.length > 0) {
            return res.status(200).json(uniqueMaterials);
        } else {
            return res.status(500).json({ message: 'No hay materiales únicos creados' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer los materiales únicos' });
    }
}

//! Gets all materials unique assigned to a worker (Checked)
const getUserMaterialsUnique = async (req, res) => {
    try {
        const { id } = req.params
        const userUniqueMaterials = await getWorkersMaterials(id)
        if (userUniqueMaterials.length > 0) {
            return res.status(200).json(userUniqueMaterials);
        } else {
            return res.status(500).json({ message: 'No hay materiales únicos asignados al trabajador' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer los materiales únicos del trabajador' });
    }
}

//! Gets all materials unique by type (Checked)
const getTypeMaterialsUnique = async (req, res) => {
    try {
        const { id } = req.params
        const uniqueMaterialsByType = await getUniqueMaterialsByType(id)
        if (uniqueMaterialsByType.length > 0) {
            return res.status(200).json(uniqueMaterialsByType);
        } else {
            return res.status(500).json({ message: 'No hay materiales únicos del tipo solicitado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer los materiales únicos por tipo' });
    }
}

//! Gets all DATA materials unique (Checked)
const getAllDataMaterialsUnique = async (req, res) => {
    try {
        const dataMaterials = await getAllDataMaterials()
        if (dataMaterials.length > 0) {
            return res.status(200).json(dataMaterials);
        } else {
            return res.status(500).json({ message: 'No hay materiales únicos creados' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer los materiales únicos' });
    }
}

//! Creates many material uniques from a selected invoice
const createManyMaterialsUnique = async (req, res) => {
    try {
        const { order, material_group, assigner } = req.body;
        const { id_factura } = order;
        // Gets the number of all the inserts to be made
        const total_inserts = material_group.map(group => group.quantity).reduce((acc, curVal) => acc + curVal)
        // Sets the counter in order to compare it with the number of total_inserts
        let count = 0
        // For each material group added it will iterate its quantity and create the new material unique and the assignments
        await material_group.forEach(async ({ id, quantity, price }) => {
            for (let i = 1; i <= quantity; i++) {
                const material_unique = await newMaterialUnique(id, id_factura, price, assigner)
                // Gets the material_unique's id to use it in material_assignment
                const id_material_unique = material_unique.affectedRows !== 0 && material_unique.insertId
                if (id_material_unique) {
                    const material_assignment = await firstMaterialAssignment(id_material_unique, assigner)
                    material_assignment.insertId && count++
                    if (count === total_inserts) {
                        return res.status(200).json({ message: 'La asignación se ha completado' });
                    }
                }
            }
        });
    } catch (error) {
        return res.status(200).json({ message: 'error al crear una factura' });
    }
}

//! Gets material unique info by its id (Checked)
const getMaterialById = async (req, res) => {
    try {
        const { id } = req.params
        const uniqueMaterials = await getUniqueMaterialById(parseInt(id))
        if (uniqueMaterials.length > 0) {
            return res.status(200).json(uniqueMaterials);
        } else {
            return res.status(500).json({ message: 'No hay materiales únicos del tipo solicitado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer los materiales únicos por tipo' });
    }
}

const createNewMaterialUnique = async (req, res) => {
    try {
        const { material_group, invoice, id_trabajador, precio, ga_code, assigner, notas, type, serial_number, imei } = req.body;
        console.log('req.body: ', req.body);
        // Checks if the GA_CODE already exist
        const gaCodeExists = await getUniqueMaterialByGACode(ga_code)
        const serialNumberExists = await getUniqueMaterialBySerial(serial_number)
        if (gaCodeExists.length !== 0 || serialNumberExists.length !== 0) {
            // If exists, it will return a message
            return res.status(500).json({ message: 'El código GA o el número de serie ya existe' });
        } else {
            // If it doesnt exist, it can be added
            pool.getConnection((err, connection) => {
                connection.beginTransaction(err => {
                    connection.query(`INSERT INTO ga_orion.material_uniq ( id_material_group, id_factura, id_trabajador, precio, ga_code, serial_number, created_by ) values ( ?, ?, ?, ?, ?, ?, ? )`,
                        [material_group, invoice, id_trabajador, precio, ga_code, serial_number, assigner], (error, results) => {
                            if (error) { return connection.rollback(() => { throw error; }) };
                            if (results.insertId) {
                                // Takes the material_unique_id from the insert to create the assignment
                                const id_material_unico = results.insertId;
                                const id_trabajador_origen = 1; // Storage
                                connection.query(`INSERT INTO ga_orion.asignacion_material ( id_trabajador_origen, id_trabajador_destino, id_material_unico, notas, assigner ) VALUES ( ?, ?, ?, ?, ? )`,
                                    [id_trabajador_origen, id_trabajador, id_material_unico, notas, assigner], (error, results) => {
                                        if (error) { return connection.rollback(() => { throw error; }) };
                                        if (results.insertId) {
                                            // Stores the code in the ga_codes/p_codes table
                                            const tableName = [7, 24, 26, 27, 28, 29].includes(type) ? 'ga_codes' : 'p_codes';
                                            const id_code = ga_code.replace(/^\D+/g, '');
                                            if (id_code.length === 3) {
                                                connection.query(`INSERT INTO ga_orion.${tableName} (id, id_material_unique) values ( ? , ? )`,
                                                    [Number(id_code), id_material_unico], (error, results) => {
                                                        if (error) { return connection.rollback(() => { throw error; }) };
                                                        if (results.insertId) {
                                                            if (type === 18) {
                                                                connection.query(`INSERT INTO ga_orion.telefonia ( id_material_unique, imei ) VALUES ( ?, ? )`,
                                                                    [id_material_unico, imei], (error, results) => {
                                                                        if (error) { return connection.rollback(() => { throw error; }) };
                                                                        console.log('Telefonía insertada');
                                                                        results.insertId && connection.commit((err) => {
                                                                            if (err) { return connection.rollback(function () { throw err; }) }
                                                                            return res.status(200).json({ message: '¡Nuevo material creado!' });
                                                                        });
                                                                    })
                                                            } else {
                                                                connection.commit((err) => {
                                                                    if (err) { return connection.rollback(function () { throw err; }) }
                                                                    return res.status(200).json({ message: '¡Nuevo material creado!' });
                                                                });
                                                            }
                                                        }
                                                    })
                                            }
                                        }
                                    })

                            }
                        })
                })
            })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el material único' });
    }
}
//! Generates a new code and updates the serial number
const createCodeAndSerial = async (req, res) => {
    try {
        const { serial_number, id_tipo, imei } = req.body
        const { id } = req.params
        const checkParams = serial_number && id_tipo && id && true

        if (!checkParams) {
            return res.status(500).json({ message: 'Error al crear el código' });
        } else {
            const prefix = isPC(id_tipo) ? 'GA' : 'P'
            prefix && pool.getConnection((err, connection) => {
                connection.beginTransaction(err => {
                    connection.query(`INSERT INTO ga_orion.${prefix === 'GA' ? 'ga_codes' : 'p_codes'} (id_material_unique) values ( ? )`, [id], (error, results) => {
                        if (error) { return connection.rollback(() => { throw error; }) }
                        if (results.insertId) {
                            const code = prefix.concat(String(results.insertId))
                            code && connection.query(`UPDATE ga_orion.material_uniq SET serial_number = ?, ga_code= ? WHERE id= ?`, [serial_number, code, id], (error, results) => {
                                if (error) { return connection.rollback(() => { throw error; }) }
                                if (results.affectedRows !== 0) {
                                    if (id_tipo === 18 && imei) {
                                        connection.query(`INSERT INTO ga_orion.telefonia ( imei, id_material_unique ) values ( ? , ? )`, [imei, id], (error, results) => {
                                            if (results.insertId) {
                                                connection.commit((err) => {
                                                    if (err) { return connection.rollback(function () { throw err; }) }
                                                    return res.status(200).json({ message: 'Código generado correctamente' });
                                                });
                                            }
                                        })
                                    } else {
                                        connection.commit((err) => {
                                            if (err) { return connection.rollback(function () { throw err; }) }
                                            return res.status(200).json({ message: 'Código generado correctamente' });
                                        });
                                    }
                                }
                            })
                        }
                    })
                })
            })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el código' });
    }
}

//! Sends a material unique to trash or storage
const sendToTrashOrStorage = (req, res) => {
    try {
        const { toStorage, toTrash, id_trabajador_origen, assigner, notas } = req.body
        const { id } = req.params
        const checkParams = ((toTrash || toStorage) && id) && true
        if (!checkParams) {
            return res.status(500).json({ message: 'Error al ejecutar la asignación' });
        } else {
            const id_trabajador_destino = toStorage ? 1 : 3
            id_trabajador_destino && pool.getConnection((err, connection) => {
                connection.beginTransaction(err => {
                    connection.query(`UPDATE ga_orion.material_uniq SET id_trabajador= ? WHERE id= ?`, [id_trabajador_destino, id], (error, results) => {
                        if (error) { return connection.rollback(() => { throw error; }) }
                        if (results.affectedRows !== 0) {
                            connection.query(`INSERT INTO ga_orion.asignacion_material ( id_trabajador_origen, id_trabajador_destino, id_material_unico, assigner, notas ) 
                                            VALUES ( ?, ?, ?, ?, ? )`, [id_trabajador_origen, id_trabajador_destino, id, assigner, notas], (error, results) => {
                                if (error) { return connection.rollback(() => { throw error; }) }
                                (results.affectedRows !== 0) && connection.commit((err) => {
                                    if (err) { return connection.rollback(function () { throw err; }) }
                                    return res.status(200).json({ message: 'Asignación creada correctamente' });
                                });
                            })
                        }
                    })
                })
            })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al ejecutar la asignación' });
    }
}


module.exports = { getAllMaterialsUnique, getUserMaterialsUnique, getTypeMaterialsUnique, getAllDataMaterialsUnique, createManyMaterialsUnique, getMaterialById, createNewMaterialUnique, createCodeAndSerial, sendToTrashOrStorage };
