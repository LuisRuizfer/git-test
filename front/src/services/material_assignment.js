// Imports
import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACK_URL;

//! Takes the data and sends it to the backend in order to create the assignments
export async function createManyAssignments(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-assignment`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets material unique assignment log
export async function getMaterialUniqueLog(id) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-assignment/${id}`,
            method: 'GET',
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets assignments log by user
export async function getLogByUser(id) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-assignment-user/${id}`,
            method: 'GET',
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}