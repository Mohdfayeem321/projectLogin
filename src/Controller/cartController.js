//===================== Importing Module and Packages =====================//
const cartModel = require('../Model/cartModel')
const productModel = require('../Model/productModel')
const validator = require('../Validator/validator')

//<<<===================== This function is used for Create Cart Data =====================>>>//
const createCart = async (req, res) => {

    try {

        let userId = req.params.userId
        let data = req.body

        //===================== Destructuring Cart Body Data =====================//
        let { cartId, productId, quantity, ...rest } = data

        //===================== Checking Field =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put Something(i.e. cartId, productId)." });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only cartId, productId." }) }

        //===================== Validation of productId =====================//
        if(typeof productId!=='string') return res.status(400).send({ status: false, message: "you have to put productId in string format only" })
        if (!validator.isValidBody(productId)) return res.status(400).send({ status: false, message: "Enter ProductId." })
        if (!validator.isValidObjectId(productId)) return res.status(400).send({ status: false, message: `This ProductId: ${productId} is not valid!` })

        //===================== Fetching Product Data is Present or Not =====================//
        let checkProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!checkProduct) { return res.status(404).send({ status: false, message: `This ProductId: ${productId} is not exist!` }) }


        if (quantity || typeof quantity == 'string') {

            if (!validator.isValidBody(quantity)) return res.status(400).send({ status: false, message: "Enter a valid value for quantity!" });
            if (!validator.isValidNum(quantity)) return res.status(400).send({ status: false, message: "Quantity of product should be in numbers." })

        } else {
            quantity = 1
        }

        //===================== Assign Value =====================//
        let Price = checkProduct.price


        if (cartId) {

            //===================== Checking the CartId is Valid or Not by Mongoose =====================//
            if (!validator.isValidBody(cartId)) return res.status(400).send({ status: false, message: "Enter a valid cartId" });
            if (!validator.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: `This cartId: ${cartId} is not valid!.` })

            //===================== Fetch the Cart Data from DB =====================//
            let checkCart = await cartModel.findOne({ _id: cartId, userId: userId }).select({ _id: 0, items: 1, totalPrice: 1, totalItems: 1 })

            //===================== This condition will run when Card Data is present =====================//
            if (checkCart) {

                let items = checkCart.items
                let object = {}

                //===================== Run Loop in items Array =====================//
                for (let i = 0; i < items.length; i++) {

                    //===================== Checking both ProductId are match or not =====================//
                    if (items[i].productId.toString() == productId) {

                        items[i]['quantity'] = (items[i]['quantity']) + quantity
                        let totalPrice = checkCart.totalPrice + (quantity * Price)
                        let totalItem = items.length

                        //===================== Push the Key and Value into Object =====================//
                        object.items = items
                        object.totalPrice = totalPrice
                        object.totalItems = totalItem

                        //===================== Update Cart document =====================//
                        let updateCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: object }, { new: true }).populate('items.productId')

                        return res.status(201).send({ status: true, message: "Success", data: updateCart })

                    }
                }

                //===================== Pushing the Object into items Array =====================//
                items.push({ productId: productId, quantity: quantity })
                let tPrice = checkCart.totalPrice + (quantity * Price)

                //===================== Push the Key and Value into Object =====================//
                object.items = items
                object.totalPrice = tPrice
                object.totalItems = items.length

                //===================== Update Cart document =====================//
                let update1Cart = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: object }, { new: true }).populate('items.productId')

                return res.status(201).send({ status: true, message: "Success", data: update1Cart })

            } else {

                return res.status(404).send({ status: false, message: 'Cart is not exist with this userId!' })
            }

        } else {

            //===================== Fetch the Cart Data from DB =====================//
            let cart = await cartModel.findOne({ userId: userId })

            //===================== This condition will run when Card Data is not present =====================//
            if (!cart) {

                //===================== Make a empty Array =====================//
                let arr = []
                let totalPrice = quantity * Price

                //===================== Pushing the Object into items Arr =====================//
                arr.push({ productId: productId, quantity: quantity })

                //===================== Create a object for Create Cart =====================//
                let obj = {
                    userId: userId,
                    items: arr,
                    totalItems: arr.length,
                    totalPrice: totalPrice
                }

                //===================== Final Cart Creation =====================//
                await cartModel.create(obj)

                let resData = await cartModel.findOne({ userId }).populate('items.productId')

                return res.status(201).send({ status: true, message: "Success", data: resData })

            } else {

                return res.status(400).send({ status: false, message: "You have already CardId which is exist in your account." })
            }
        }

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}



//===================== Module Export =====================//
module.exports = { createCart }