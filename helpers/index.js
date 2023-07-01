// Dependecies
// const moment = require("moment");
import encrypt from "bcryptjs";

export const rando = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export const getrandomId = (strLength) => {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into the string
        var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

        // Start the final string
        var str = '';
        for (let i = 1; i <= strLength; i++) {
            // Get a random character from the possibleCharacter string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the final string
            str += randomCharacter;
        }

        // Return the final string
        return str;

    } else {
        return false;
    }
}

export const getRandomLetters = (strLength) => {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into the string
        let possibleCharacters = "abcdefghijklmnopqrstuvwxyz";

        // Start the final string
        let str = '';
        for (let i = 1; i <= strLength; i++) {
            // Get a random character from the possibleCharacter string
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the final string
            str += randomCharacter;
        }

        // Return the final string
        return str;

    } else {
        return false;
    }
}

export const getRandomNumber = (strLength) => {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into the string
        let possibleCharacters = "0123456789";

        // Start the final string
        let str = '';
        for (let i = 1; i <= strLength; i++) {
            // Get a random character from the possibleCharacter string
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the final string
            str += randomCharacter;
        }

        // Return the final string
        return str;

    } else {
        return false;
    }
}

export const orderObjectBy = (obj, name) => {
    if (typeof (obj) == 'object') {
        name = name.toString().toLowerCase();
        obj.sort((a, b) => {
            let fir = a[name] ? a[name].toString().toLowerCase() : "nill", sec = b[name] ? b[name].toString().toLowerCase() : "nill";
            return fir == sec ? 0 : fir > sec ? 1 : -1;
        })
        return (obj)
    } else {
        throw new Error('param must be of object type');
    }
}

export const sumOfList = (list) => {
    list = typeof (list) == "object" && list instanceof Array && list.length > 0 ? list : typeof (list) == "string" && list.trim().length > 0 ? list.trim() : false;
    let num = (n) => isNaN(parseInt(n)) ? 0 : n;
    if (list) {
        let result = 0;
        list.forEach(data => {
            result = result + num(data);
        })
        return (result);
    } else {
        return 0
    }
}

export const listFromObj = (obj, list) => {
    obj = typeof (obj) == "object" ? obj : {};
    list = typeof (list) == "string" ? list.trim() : false;
    if (obj && list) {
        let result = [];
        obj.map(item => {
            result.push(item[list])
        });
        return result;
    } else {
        console.log("null");
        return "Not found!";
    }
}

export const formatNumber = (num) => {
    num = typeof (num) == "string" || "number" ? Math.abs(parseInt(num)) : false;
    let log = Math.log(num) / Math.log(10);
    let base = {
        "k": 3,
        "m": 6,
        "b": 9,
        "t": 12,
        "q": 15
    }
    if (log < 3) {
        return (num)
    } else if (num > 3) {
        return `${(num / 1000).toFixed(2)}k`;
    }
}

export const encryptString = async (str) => {
    str = typeof (str) == "string" && str.trim().length > 0 ? str.trim() : false;

    if (str) {
        let salt = await encrypt.genSalt();
        let hashed = await encrypt.hash(str, salt);
        return hashed;
    } else {
        return false
    }
}

export const compareCrypt = async (str, hashed) => {
    str = typeof (str) == "string" && str.trim().length > 0 ? str.trim() : false;
    hashed = typeof (hashed) == "string" && hashed.trim().length > 0 ? hashed.trim() : false;
    if (str) {
        let decript = await encrypt.compare(str, hashed);
        if (decript) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

// export const formatTime = (time, format) => {
// 	return moment(time).format(format);
// }