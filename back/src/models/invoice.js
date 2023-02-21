//Imports
const pool = require("../config/db");

//! Creates an order with the file uploaded from the front
const uploadNewInvoice = async (file, comments, real_date, total_price) => {
    try {
        const invoice = await pool.query(`INSERT INTO ga_orion.factura ( file, comments, real_date, total_price ) values ( ?, ?, ?, ? )`, [file, comments, real_date, total_price])
        return invoice
    } catch (error) {
        console.log(error.stack);
    }
}

const updateInvoice = async (file, comments, real_date, total_price, id) => {
    try {
        const updatedInvoice = await pool.query(`UPDATE ga_orion.factura SET file= ?, comments= ?, real_date= ?, total_price= ? WHERE id= ?`, [file, comments, real_date, total_price, id])
        return updatedInvoice
    } catch (error) {
        console.log(error.stack);
    }
}

const getLastInvoices = async () => {
    try {
        const invoices = await pool.query(`SELECT * FROM ga_orion.factura ORDER BY created_at desc`)
        return invoices
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { uploadNewInvoice, updateInvoice, getLastInvoices }
