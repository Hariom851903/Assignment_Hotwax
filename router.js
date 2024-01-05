const express = require('express');
const router=express.Router();

const {personcontroller}=require('./controller/person');
 const {product}= require('./controller/product')
   const {orderheader,orderItem,getorder,allorderget,orderupdate}  =require('./controller/order')

//------------------*******------------------------
router.post('/person',personcontroller)
router.post('/product',product);
router.post('/order-header',orderheader);
router.post('/order-item/:orderId',orderItem);


//---------------******-----------------------------
router.get('/getallorder',allorderget);
router.get('/getorder/:orderid',getorder);

//---------------*****-----------------------------
router.patch('orderupdate/:orderid',orderupdate);

module.exports = router;




