// Imports
import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACK_URL;

//! Gets all brands
export async function getAllBrands() {
    try {
        const response = await axios({
            url: `${baseUrl}/marcas`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates a new brand
export async function createNewBrand(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/marcas`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}
