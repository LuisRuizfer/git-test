import axios from "axios";

const baseUrl = process.env.REACT_APP_BACK_URL;

//! Gets all positions.
export async function getAllPositions() {
    try {
        const response = await axios({
            url: `${baseUrl}/positions`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates a new position.
export async function createPosition(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/positions`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}
