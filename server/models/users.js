let mongoose=require('mongoose')
let userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
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
  "addressList":Array
})
module.exports=mongoose.model("User",userSchema)
