<template>
    <div>
      <nav-header></nav-header>
      <nav-bread><span slot="bread">Order Comfirm</span></nav-bread>
      <div class="container">
        <div class="checkout-order">
          <div class="page-title-normal">
            <h2 class="page-title-h2"><span>check out</span></h2>
          </div>
          <!-- process step -->
          <div class="check-step">
            <ul>
              <li class="cur"><span>Confirm</span> address</li>
              <li class="cur"><span>View your</span> order</li>
              <li><span>Make</span> payment</li>
              <li><span>Order</span> confirmation</li>
            </ul>
          </div>

          <!-- order list -->
          <div class="page-title-normal checkout-title">
            <h2><span>Order content</span></h2>
          </div>
          <div class="item-list-wrap confirm-item-list-wrap">
            <div class="cart-item order-item">
              <div class="cart-item-head">
                <ul>
                  <li>Order contents</li>
                  <li>Price</li>
                  <li>Quantity</li>
                  <li>Subtotal</li>
                </ul>
              </div>
              <ul class="cart-item-list">
                <li v-for="item in cartList" :key="item.productId">
                  <div class="cart-tab-1">
                    <div class="cart-item-pic">
                      <img v-lazy="`static/img/${item.productImage}`" alt=""/>
                    </div>
                    <div class="cart-item-title">
                      <div class="item-name">{{item.productName}}</div>

                    </div>
                  </div>
                  <div class="cart-tab-2">
                    <div class="item-price">{{item.salePrice | currency('$')}}</div>
                  </div>
                  <div class="cart-tab-3">
                    <div class="item-quantity">
                      <div class="select-self">
                        <div class="select-self-area">
                          <span class="select-ipt">×{{item.productNum}}</span>
                        </div>
                      </div>
                      <div class="item-stock item-stock-no">In Stock</div>
                    </div>
                  </div>
                  <div class="cart-tab-4">
                    <div class="item-price-total">{{(item.productNum*item.salePrice) | currency('$')}}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- Price count -->
          <div class="price-count-wrap">
            <div class="price-count">
              <ul>
                <li>
                  <span>Item subtotal:</span>
                  <span>{{subtotal | currency('$')}}</span>
                </li>
                <li>
                  <span>Shipping:</span>
                  <span>{{shipping | currency('$')}}</span>
                </li>
                <li>
                  <span>Discount:</span>
                  <span>{{discount | currency('$')}}</span>
                </li>
                <li>
                  <span>Tax:</span>
                  <span>{{tax | currency('$')}}</span>
                </li>
                <li class="order-total-price">
                  <span>Order total:</span>
                  <span>{{totalPrice | currency('$')}}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="order-foot-wrap">
            <div class="prev-btn-wrap">
              <router-link class="btn btn--m" to="/address">Previous</router-link>
            </div>
            <div class="next-btn-wrap">
              <button class="btn btn--m btn--red" @click="payMent">Proceed to payment</button>
            </div>
          </div>
        </div>
      </div>
      <nav-footer/>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'
import {currency} from '@/util/currency'
import axios from 'axios'
export default {
  name: 'OrderConfirm',
  components: {NavHeader, NavFooter, NavBread},
  data: () => ({
    cartList: [],
    shipping: 100,
    discount: 200,
    tax: 400
  }),
  computed: {
    subtotal () {
      let total = 0
      this.cartList.forEach(item => {
        total += parseFloat(item.salePrice) * parseInt(item.productNum)
      })
      return total
    },
    totalPrice () {
      return this.subtotal + this.tax - this.discount + this.shipping
    }
  },
  created () {
    this.getCartCheckedList()
  },
  filters: {
    currency: currency
  },
  methods: {
    getCartCheckedList () {
      axios.get('/users/cartList/checked').then(res => {
        let result = res.data
        if (result.status === '0') {
          this.cartList = result.result
        } else {
          console.log(result.msg)
        }
      })
    },
    payMent () {
      axios.post('/users/payment', {addressId: this.$route.query.addressId, orderTotal: this.totalPrice}).then(res => {
        let result = res.data
        if (result.status === '0') {
          this.$router.push({
            path: '/orderSuccess?orderId=' + result.result.orderId
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
