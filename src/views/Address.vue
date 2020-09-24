<template>
<div>
  <nav-header></nav-header>
  <nav-bread><span slot="bread">Address</span></nav-bread>
  <div class="container">
    <div class="checkout-addr">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- process step -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li><span>View your</span> order</li>
          <li><span>Make</span> payment</li>
          <li><span>Order</span> confirmation</li>
        </ul>
      </div>

      <!-- address list -->
      <div class="page-title-normal checkout-title">
        <h2><span>Shipping address</span></h2>
      </div>
      <div class="addr-list-wrap">
        <div class="addr-list">
          <ul>
            <li v-for="(item,index) in addressListFilter" :key="item.addressId" :class="{'check':checkedIndex===index}" @click="checkedIndex=index">
              <dl>
                <dt>{{item.userName}}</dt>
                <dd class="address">{{item.streetName}}</dd>
                <dd class="tel">{{item.tel}}</dd>
              </dl>

              <div class="addr-opration addr-del" >
                <a href="javascript:;" style="background: #999999" class="item-edit-btn addr-del-btn" @click="delAddressConfirm(item.addressId)">
                  <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
                </a>
              </div>
              <div class="addr-opration addr-default" v-if="!item.isDefault" @click="setDefault(item.addressId)">
                <a href="javascript:;" class="addr-set-default-btn"><i>Set default</i></a>
              </div>
              <div class="addr-opration addr-default" v-if="item.isDefault">Default address</div>
            </li>
            <li class="addr-new">
              <div class="add-new-inner">
                <i class="icon-add">
                  <svg class="icon icon-add"><use xlink:href="#icon-add"></use></svg>
                </i>
                <p>Add new address</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="shipping-addr-more" v-if="addressList.length>3">
          <a class="addr-more-btn up-down-btn" href="javascript:;" @click="expend" :class="{'open':limit>3}">
            more
            <i class="i-up-down">
              <i class="i-up-down-l"></i>
              <i class="i-up-down-r"></i>
            </i>
          </a>
        </div>
      </div>

      <!-- shipping method-->
      <div class="page-title-normal checkout-title">
        <h2><span>Shipping method</span></h2>
      </div>
      <div class="lemall-msg-info hidden">
        <span>The region you selected is not within our delivery area. Please select another shipping address within our delivery areas.</span>
      </div>
      <div class="shipping-method-wrap">
        <div class="shipping-method">
          <ul>
            <li class="check">
              <div class="name">Standard shipping</div>
              <div class="price">Free</div>
              <div class="shipping-tips">
                <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="next-btn-wrap">
        <router-link class="btn btn--m btn--red" :to="{path:'/orderConfirm',query:{'addressId':selectedAddressId}}">Next</router-link>
      </div>
    </div>
  </div>
  <model :mdShow="modelConfirm" @close="closeModel">
    <p slot="message">
      你确定要删除此数据吗？
    </p>
    <div slot="btnGroup">
      <a href="javascript:;" class="btn btn--m" @click="closeModel">关闭</a>
      <a href="javascript:;" class="btn btn--m" @click="delAddress" >确定</a>
    </div>
  </model>
  <nav-footer/>
</div>
</template>

<script type="text/ecmascript-6">
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'
import axios from 'axios'
import Model from '@/components/Model'
export default {
  data: () => ({
    addressList: [],
    limit: 3,
    checkedIndex: 0,
    modelConfirm: false,
    delId: ''
  }),
  components: {NavHeader, NavFooter, NavBread, Model},
  created () {
    this.init()
  },
  computed: {
    addressListFilter () {
      return this.addressList.slice(0, this.limit)
    },
    selectedAddressId () {
      let findAddress = this.addressList.find((item, index) => this.checkedIndex === index)
      return findAddress ? findAddress.addressId : ''
    }
  },
  methods: {
    init () {
      axios.get('/users/address/list').then(res => {
        let result = res.data
        if (result.status === '0') {
          this.addressList = result.result
        }
      })
    },
    expend () {
      if (this.limit === 3) {
        this.limit = this.addressList.length
      } else {
        this.limit = 3
      }
    },
    setDefault (id) {
      axios.post('/users/address/default', {addressId: id}).then((res) => {
        let result = res.data
        if (result.status === '0') {
          this.addressList.forEach(item => {
            if (item.addressId === id) {
              item.isDefault = true
            } else {
              item.isDefault = false
            }
          })
        } else {
          console.log(result.msg)
        }
      })
    },
    closeModel () {
      // this.mdShow = false
      this.modelConfirm = false
    },
    delAddressConfirm (id) {
      this.modelConfirm = true
      this.delId = id
    },
    delAddress () {
      axios.post('/users/address/del', {addressId: this.delId}).then(res => {
        let result = res.data
        if (result.status === '0') {
          this.addressList.forEach((item, index) => {
            if (item.addressId === this.delId) {
              this.addressList.splice(index, 1)
            }
          })
        } else {
          console.log('删除失败')
        }
      })
      this.modelConfirm = false
    }
  }
}
</script>

<style >
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
