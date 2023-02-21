// Imports
import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACK_URL;

//! Gets all models
export async function getAllModels() {
    try {
        const response = await axios({
            url: `${baseUrl}/modelos`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets all models BY BRAND
export async function getAllModelsByBrand(id) {
    try {
        const response = await axios({
            url: `${baseUrl}/modelos-marca/${id}`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates a new model
export async function createNewModel(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/modelos`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}
