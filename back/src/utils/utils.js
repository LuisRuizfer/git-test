/**
 * Returns true if the id is 'PC' type
 * @param {Number} id Type id
 */
const isPC = (id) => {
    return [7, 24, 26, 27, 28, 29].includes(id)
}

const getFileDate = (fecha) => {
    const day = (fecha.getDate() < 10) ? `0${fecha.getDate()}` : fecha.getDate()
    const month = (fecha.getMonth() < 10) ? `0${fecha.getMonth()}` : fecha.getMonth()
    const year = fecha.getFullYear()
    const hours = fecha.getHours() < 10 ? `0${fecha.getHours()}` : fecha.getHours()
    const minutes = fecha.getMinutes() < 10 ? `0${fecha.getMinutes()}` : fecha.getMinutes()
    return `${year}${month}${day}${hours}${minutes}`
}

/**
 * Gets a short date from a full one (YYYY-MM-DD)
 * @param {Sting} fecha Date to shorten
 */
 const shortenDate = (fecha) => {
    const date = new Date(fecha);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    return `${day}/${month}/${year}`;
}

module.exports = { isPC, getFileDate, shortenDate }