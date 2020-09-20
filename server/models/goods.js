/**
 * Created by wlp6897 on 2020/9/18.
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema

let productSchema = new Schema({
  productId: {type: String},
  productName: String,
  salePrice: Number,
  productImage: String,
  productUrl:String
})
// Good 与 goods 相关联
module.exports = mongoose.model('Good', productSchema, 'goods')
