//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const { Authentication, Authorization } = require('../MiddleWare/auth')
const { createUser, userLogin } = require('../Controller/userController')
const { createProduct, getProduct, getProductById, updateProduct, deleteProduct } = require('../Controller/productController')
const { createCart} = require('../Controller/cartController')
const { createOrder, getOrderDetailsByUser, getOrderDeatils } = require('../Controller/orderController');
const {adminLogin, createAdmin} = require("../Controller/adminController")



//<<<=========================== USER's APIs(FEATURE I) ===========================>>>//

//===================== User Registration (Post API) =====================//
router.post("/register", createUser)
//===================== User Login (Post API) =====================//
router.post("/login", userLogin)


//===================== Admin API =====================//


router.post("/createAdmin", createAdmin)
//===================== User Login (Post API) =====================//
router.post("/Adminlogin", adminLogin)

//<<<===================== PRODUCT's APIs(FEATURE II) =====================>>>//

//===================== User Registration (Post API) =====================//
router.post("/createProduct/:adminId", Authentication, Authorization, createProduct)
//===================== Get User Data by Query Param(Get API) =====================//
router.get("/products", getProduct)
//===================== Get User Data by Path Param (Get API) =====================//
router.get("/products/:productId", getProductById)
//===================== Update Product (Put API) =====================//
router.put("/products/:adminId", Authentication, Authorization, updateProduct)
//===================== Delete Product (Delete API) =====================//
router.delete("/products/:adminId", Authentication, Authorization, deleteProduct)
//<<<============================================================================>>>//


//<<<===================== CART's APIs(FEATURE III) =====================>>>//

//===================== Create Cart (Post API) =====================//
router.post("/users/:userId/cart", Authentication, Authorization, createCart)


//<<<===================== Order's APIs(FEATURE IV) =====================>>>//

//===================== Create Order (Post API) =====================//
router.post("/users/:userId/orders", Authentication, Authorization, createOrder)

router.get("/users/:orderId/orders", Authentication, Authorization, getOrderDetailsByUser);

router.get("/users/:userId/orders", Authentication, Authorization, getOrderDeatils);


//<<<============================================================================>>>//

//<<<===================== It will Handle error When You input Wrong Route =====================>>>//

router.all("/**",  (req, res) => {
    return res.status(404).send({ status: false, msg: "This API you request is not Available!" })
});

//===================== Module Export =====================//

module.exports = router;  