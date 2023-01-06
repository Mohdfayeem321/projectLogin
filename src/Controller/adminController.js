const adminModel = require("../Model/adminModel");

const validator = require("../Validator/validator")

const JWT = require("jsonwebtoken")

//<<<===================== This function is used for Create User =====================>>>//
const createAdmin = async (req, res) => {

    try {

        let data = req.body

        //===================== Destructuring User Body Data =====================//
        let { fname, lname, email, password, ...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. fname, lname, email, password " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only fname, lname, email, password" }) }



        //===================== Validation of Data =====================//
        if (!validator.isValidBody(fname)) { return res.status(400).send({ status: false, message: 'Please enter fname' }) }
        if (!validator.isValidName(fname)) { return res.status(400).send({ status: false, message: 'fname should be in Alphabets' }) }

        if (!validator.isValidBody(lname)) { return res.status(400).send({ status: false, message: 'Please enter lname' }) }
        if (!validator.isValidName(lname)) { return res.status(400).send({ status: false, message: 'lname should be in Alphabets' }) }

        if (!validator.isValidBody(email)) { return res.status(400).send({ status: false, message: 'Please enter the EmailId' }) }
        if (!validator.isValidEmail(email)) { return res.status(400).send({ status: false, message: 'Please enter valid emailId' }) }


        if (!validator.isValidBody(password)) { return res.status(400).send({ status: false, message: 'Please enter the password' }) }
        if (!validator.isValidpassword(password)) { return res.status(400).send({ status: false, message: "To make strong Password Should be use 8 to 15 Characters which including letters, atleast one special character and at least one Number." }) }



        //===================== Fetching data of Email from DB and Checking Duplicate Email or Phone is Present or Not =====================//

        let isDuplicateEmail = await adminModel.findOne({email})
        if (isDuplicateEmail) { return res.status(400).send({ status: false, message: `This EmailId: ${email} is already exist!` }) }

        //x===================== Final Creation of User =====================x//

        let adminCreated = await adminModel.create(data)

        return res.status(201).send({ status: true, message: "Admin created successfully", data: adminCreated })

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}





//<<<===================== This function is used for Login the User =====================>>>//

const adminLogin = async function (req, res) {

    try {

        let data = req.body

        //===================== Destructuring User Body Data =====================//
        let { email, password, ...rest } = data

        //=====================Checking User input is Present or Not =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "You have to input email and password." });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can enter only email and password." }) }

        //=====================Checking Format of Email & Password by the help of Regex=====================//
        if (!validator.isValidBody(email)) return res.status(400).send({ status: false, message: "EmailId required to login" })
        if (!validator.isValidEmail(email)) { return res.status(400).send({ status: false, message: "Invalid EmailID Format or Please input all letters in lowercase." }) }

        if (!validator.isValidBody(password)) return res.status(400).send({ status: false, message: "Password required to login" })
        if (!validator.isValidpassword(password)) { return res.status(400).send({ status: false, message: "Invalid Password Format! Password Should be 8 to 15 Characters and have a mixture of uppercase and lowercase letters and contain one symbol and then at least one Number." }) }

        //===================== Fetch Data from DB =====================//
        const adminData = await adminModel.findOne({ email: email, password:password})
        if (!adminData) { return res.status(401).send({ status: false, message: "Invalid Login Credentials! You need to register first." }) }


        let payload = {
            adminId: adminData['_id'].toString(),
            Project: "Node Js Interview Project",
        }

        const token = JWT.sign({ payload }, "User Login", { expiresIn: "2d" });

        //=====================Create a Object for Response=====================//
        let obj = { adminId: adminData['_id'], token: token }

        return res.status(200).send({ status: true, message: 'Admin login successfull', data: obj })


    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}


module.exports = {createAdmin, adminLogin}