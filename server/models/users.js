let mongoose=require('mongoose')
let userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":[{
    "orderId" : String,
    "orderTotal" : String,
    "orderStatus" : String,
    "createDate" : String,
    "goodsList" : Array,
    "addressInfo" :Object ,
  }],
  "cartList":[
    {
      "productId":{type: String},
      "productName": String,
      "salePrice": Number,
      "productImage": String,
      "productUrl":String,
      "checked":String,
      "productNum":Number
    }
  ],
  "addressList":[
    {
      "addressId":String,
      "addressId" : String,
      "userName" : String,
      "streetName" : String,
      "postCode" : String,
      "tel" : String,
      "isDefault" : Boolean
    }
  ]
})
module.exports=mongoose.model("User",userSchema)
