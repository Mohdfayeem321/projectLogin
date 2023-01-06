//===================== Importing Module and Packages =====================//

const productModel = require('../Model/productModel')

const validator = require('../Validator/validator')


//<<<===================== This function is used for Creating Product Data =====================>>>//

const createProduct = async (req, res) => {

    try {

        let data = req.body

        //===================== Destructuring User Body Data =====================//
        let { title, price,  ...rest } = data

        //===================== Checking Mandotory Field =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields ( title,price). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only title and price " }) }


        //===================== Validation of title =====================//
        if (!validator.isValidBody(title)) { return res.status(400).send({ status: false, message: "Please enter title!" }) }


        //===================== Validation of Price =====================//
        if (!validator.isValidBody(price)) return res.status(400).send({ status: false, message: "Please enter price!" });
        if (!validator.isValidPrice(price)) return res.status(400).send({ status: false, message: "Please valid valid price In Body!" });


        //===================== Fetching Title of Product from DB and Checking Duplicate Title is Present or Not =====================//
        const isDuplicateTitle = await productModel.findOne({ title: title });
        if (isDuplicateTitle) {
            return res.status(400).send({ status: false, message: "Title is Already Exists, Please Enter Another Title!" });
        }

        //x===================== Final Creation of Product =====================x//
        let createProduct = await productModel.create(data)

        return res.status(201).send({ status: true, message: "Success", data: createProduct })

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}


//<<<===================== This function is used for Get Data of Products =====================>>>//

const getProduct = async (req, res) => {

    try {

        let data = req.body;

        const { page = 1, limit = 10 } = req.query

        //===================== Destructuring User Body Data =====================//
        let { title, price, ...rest } = data

        //===================== Checking Mandotory Field =====================//
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only title and price." }) }

        if (!validator.checkInputsPresent(data)) {

            let productData = await productModel.find({ isDeleted: false }).limit(limit*1).skip((page-1)*limit).sort('-createdAt')

            if (productData.length == 0) return res.status(404).send({ status: false, message: "Products not found" })

            return res.status(200).send({ status: true, message: "Success", data: productData.length, productData });
        }

        //===================== Create a Object of Product =====================//
        
        let obj = { isDeleted: false }

        if(title){
            
            obj["title"] = title;

        }

        if(title){
            
            obj["price"] = price;
            
        }

        //x===================== Fetching All Data from Product DB =====================x//
        let getProduct = await productModel.find(obj).sort({ price: -1 })

        //===================== Checking Data is Present or Not in DB =====================//
        if (getProduct.length == 0) return res.status(404).send({ status: false, message: "Product Not Found." })

        return res.status(200).send({ status: true, message: "Success", data: getProduct })

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}


//<<<===================== This function is used for Get Data of Products By Path Param =====================>>>//
const getProductById = async (req, res) => {

    try {

        let productId = req.params.productId

        //===================== Checking the ProductId is Valid or Not by Mongoose =====================//

        if (!validator.isValidObjectId(productId)) return res.status(400).send({ status: false, message: `Please Enter Valid ProductId: ${productId}.` })

        //x===================== Fetching All Data from Product DB =====================x//

        let getProduct = await productModel.findOne({ _id: productId, isDeleted: false })

        //===================== Checking Data is Present or Not in DB =====================//

        if (!getProduct) return res.status(404).send({ status: false, message: "Product Data is Not Found!" })

        return res.status(200).send({ status: true, message: "Success", data: getProduct })

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}






//<<<===================== This function is used for Update Products Data By Path Param =====================>>>//

const updateProduct = async (req, res) => {

    try {

        let data = req.body

        //===================== Destructuring User Body Data ===========================================//

        let { title, price, ...rest } = data


        //===================== Checking Body ==========================================================//

        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "You have to put atleast one key to update Product (i.e. title, description, price, isFreeShipping, style, availableSizes, installments, productImage). " });

        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can enter to update only title, description, price, isFreeShipping, style, availableSizes, installments, productImage." }) }


        //===================== Create a Object of Product ===============================================//
        let obj = {}

        //===================== Validation of title ======================================================//

        if (title || title == '') {

            if (!validator.isValidBody(title)) { return res.status(400).send({ status: false, message: "Please enter title!" }) }

            if (!validator.isValidProdName(title)) { return res.status(400).send({ status: false, message: "Please mention valid title In Body!" }) }

            //===================== Fetching Title of Product from DB and Checking Duplicate Title is Present or Not =====================//
            let isDuplicateTitle = await productModel.findOne({ title: title });

            if (isDuplicateTitle) {

                return res.status(400).send({ status: false, message: "Title is Already Exists, Please Enter Another One Title!" });
            }

            obj.title = title
        }

        //===================== Validation of Price =============================================//
        if (price || price == '') {

            if (!validator.isValidBody(price)) return res.status(400).send({ status: false, message: "Please enter price!" });

            if (!validator.isValidPrice(price)) return res.status(400).send({ status: false, message: "Please valid valid price In Body!" });
            obj.price = price
        }

        
        //x===================== Fetching All Product Data from Product DB then Update the values =====================x//
        let updateProduct = await productModel.findOneAndUpdate({ isDeleted: false }, { $set: obj }, { new: true })

        //x===================== Checking the Product is Present or Not =====================x//
        if (!updateProduct) { return res.status(404).send({ status: false, message: "Product is not found or Already Deleted!" }); }

        return res.status(200).send({ status: true, message: "Success", data: updateProduct })

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}


//<<<===================== This function is used for Delete Product Data By Path Param =====================>>>//

const deleteProduct = async (req, res) => {

    try {

        let productId = req.query.productId

        //===================== Checking the ProductId is Valid or Not by Mongoose =====================//
        if (!validator.isValidObjectId(productId)) return res.status(400).send({ status: false, message: `Please Enter Valid ProductId: ${productId}.` })

        //x===================== Fetching All Product Data from Product DB then Update the value of isDeleted from false to true =====================x//
        let deletedProduct = await productModel.findOneAndUpdate({ isDeleted: false, _id: productId }, { isDeleted: true, deletedAt: Date.now() })

        //x===================== Checking the Product is Present or Not =====================x//
        if (!deletedProduct) { return res.status(404).send({ status: false, message: "Product is not found or Already Deleted!" }) }

        return res.status(200).send({ status: true, message: "Product Successfully Deleted." })

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}


//===================== Module Export =====================//

module.exports = { createProduct, getProduct, getProductById, updateProduct, deleteProduct }