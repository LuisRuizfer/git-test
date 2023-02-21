// Imports
import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACK_URL;

//! Gets all Materials.
export async function getAllDataMaterials() {
    try {
        const response = await axios({
            url: `${baseUrl}/material-data`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates new materials unique from the admins cart
export async function createMaterialsUniqueFromInvoice(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-unique-invoice`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets material unique info by its id
export async function getMaterialUniqueById(id) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-unique-id/${id}`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates an existing material unique
export async function createNewMaterialUnique(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-unique`,
            method: 'POST',
            data
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets all materials unique assigned to a worker
export async function getWorkersMaterials(id) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-unique-user/${id}`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Generates a new Code and updates the serial number
export async function createCodeAndSerial(data, id) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-unique/${id}`,
            method: 'PUT',
            data
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Sends the material to trash or storage
export async function sendToTrashOrStorage(data, id) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-unique-send/${id}`,
            method: 'PUT',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}