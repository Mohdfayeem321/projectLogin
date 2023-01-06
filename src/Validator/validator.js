//=====================Importing Module and Packages=====================//
const mongoose = require('mongoose')

//<<<==================================== Function for validation =======================================>>>//

//===================== Checking that there is something as Input =====================//

const checkInputsPresent = (value) => { return (Object.keys(value).length > 0); }

//===================== Validating that the Input must be a non-empty String =====================//

const isValidBody = function (value) {

    if (typeof value === "undefined" || typeof value === "null") { return false }
    if (typeof value === "string" && value.trim().length == 0) { return false }
   
    return true
}

//===================== Function to validate the input value with Regex =====================//

const isValidName = (value) => { return (/^[A-Z a-z]+$/).test(value); }

const isValidEmail = (value) => { return (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(value)); }

const isValidpassword = (value) => { return (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(value)); }

const isValidObjectId = (value) => { return mongoose.isValidObjectId(value) }


const isValidPrice = (value) => { return (/^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/).test(value) }

const isValidNum = (value) => { return /^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/.test(value);}



//===================== Module Export =====================//

module.exports = {
    checkInputsPresent,
    isValidObjectId,
    isValidBody,
    isValidName,
    isValidEmail,
    isValidpassword,
    isValidPrice,
    isValidNum
}