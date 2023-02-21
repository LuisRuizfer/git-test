/**
 * Gets a short date from a full one (YYYY-MM-DD)
 * @param {Sting} fecha Date to shorten
 */
export const shortenDate = (fecha) => {
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

/**
 * Takes a string, uppercases it and replaces accents or special characters in order to compare it
 * @param {String} str Strign to normalize
 */
export const removeAccentsAndNormalize = (str) => {
    return str.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


export const getNameByID = (listToFilter, id) => {
    return listToFilter.filter(filterElement => filterElement.id === id).map(({ name }) => name).join('')
}
/**
 * Takes two strings and compares if the first starts with the second one
 * @param {String} str1 String 1
 * @param {String} str2 String 2
 */
export const checkStartsWith = (str1, str2) => {
    return ((str1 && str2) && removeAccentsAndNormalize(str1).startsWith(removeAccentsAndNormalize(str2)))
}


export const isPC = (id) => {
    return [7, 24, 26, 27, 28, 29].includes(id)
}

export const prepareToDatabase = (text) => {
    return text.split(' ').map(t => t.charAt(0).toUpperCase() + t.slice(1).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()).join(' ')
}

export const getFileDate = (fecha) => {
    const day = (fecha.getDate() < 10) ? `0${fecha.getDate()}` : fecha.getDate()
    const month = (fecha.getMonth() < 10) ? `0${fecha.getMonth()}` : fecha.getMonth()
    const year = fecha.getFullYear()
    const hours = fecha.getHours() < 10 ? `0${fecha.getHours()}` : fecha.getHours()
    const minutes = fecha.getMinutes() < 10 ? `0${fecha.getMinutes()}` : fecha.getMinutes()
    return `${year}${month}${day}${hours}${minutes}`
}