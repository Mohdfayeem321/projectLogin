//===================== Importing Module and Packages =====================//
const orderModel = require('../Model/orderModel')
const cartModel = require('../Model/cartModel')
const validator = require('../Validator/validator')

//<<<===================== This function is used for Create Cart Data =====================>>>//
const createOrder = async (req, res) => {

    try {

        let userId = req.params.userId
        let data = req.body

        //===================== Destructuring Order Body Data =====================//
        let { cartId, ...rest } = data


        //===================== Checking Field =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "You have to put CardId." });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can put only CartId." }) }

        //===================== Checking the CartId =====================//
        if (!validator.isValidBody(cartId)) return res.status(400).send({ status: false, message: "Please enter CartId ." })
        if (!validator.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: `This cartId: ${cartId} is not valid!.` })


        //===================== Fetch the Cart Data From DB =====================//
        let findCart = await cartModel.findOne({ userId: userId, _id: cartId })
        if (!findCart) return res.status(404).send({ status: false, message: "This CartId does not exist!" })

        //===================== Checking inside cart Item is present or not =====================//
        if (findCart.items.length == 0) return res.status(400).send({ status: false, message: "This CartId is empty." })

        //===================== Push Key and value pair inside Object =====================//
        obj.userId = findCart.userId
        obj.items = findCart.items
        obj.totalPrice = findCart.totalPrice
        obj.totalItems = findCart.totalItems

        //===================== Set Quantity as '0' =====================//
        let quantity = 0

        //===================== For loop is for get total Quantity of every Product =====================//
        for (let i = 0; i < findCart.items.length; i++) {
            quantity = quantity + findCart.items[i].quantity

        }

        obj.totalQuantity = quantity

        //===================== Final Order creatation =====================//
        let orderCreate = await orderModel.create(data)

        //===================== Update or Delete that Cart Data in DB =====================//
        await cartModel.findOneAndUpdate({ _id: cartId, userId: userId }, { items: [], totalItems: 0, totalPrice: 0 })

        //===================== Return response for successful Order creation =====================//
        return res.status(201).send({ status: true, message: "Success", data: orderCreate })

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}



const getOrderDeatils = async (req, res) => {

    try {


        let orderId = req.params.orderId;

        let getDeatils = await orderModel.findOne({ orderId: orderId })

        if (!getDeatils) {
            return res.status(404).send({ status: false, message: "order deatils not found" })
        }

        return res.status(200).send({ status: true, data: getDeatils })


    } catch (error) {


        return res.status(500).send({ status: false, error: error.message })

    }


}

const getOrderDetailsByUser = async (req, res) => {

    try {

        let userId = req.params.userId;

        let getData = await orderModel.find({ userId: userId });

        if (!getData) {
            return res.status(404).send({ status: false, message: "order deatils not found" })
        }

        return res.status(200).send({ status: true, data: getData })

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })

    }

}

//===================== Module Export =========================================================//

module.exports = { createOrder, getOrderDeatils, getOrderDetailsByUser }