import axios from "axios";

const baseUrl = process.env.REACT_APP_BACK_URL;

//! Gets all locations.
export async function getAllLocations() {
    try {
        const response = await axios({
            url: `${baseUrl}/locations`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates a new location.
export async function createLocation(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/locations`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}
