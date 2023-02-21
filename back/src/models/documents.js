// Imports
const pool = require("../config/db");

const getUserDocuments = async (id) => {
    try {
        const documents = await pool.query(`SELECT id as id_document, file, signed, created_at as delivery_date FROM ga_orion.documentos WHERE worker= ? ORDER BY delivery_date desc`, [id])
        return documents
    } catch (error) {
        console.log(error.stack);
    }
}

const updateDocument = async (file, id_document) => {
    try {
        const document = await pool.query(`UPDATE ga_orion.documentos SET file= ?, signed = ? WHERE id= ?`, [file, 1, id_document])
        return document
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { getUserDocuments, updateDocument }