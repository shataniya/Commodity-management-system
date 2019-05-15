const express = require("express")
const router = express.Router()

const product = require("./admin/product.js")


router.get('/product',product)