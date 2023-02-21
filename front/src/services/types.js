// Imports
import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACK_URL;

//! Gets all types
export async function getAllTypes() {
    try {
        const response = await axios({
            url: `${baseUrl}/tipos`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates a new tipe
export async function createNewType(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/tipos`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}
