<template>
  <div>
    <nav-header></nav-header>
    <nav-bread><span slot="bread">goods</span></nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price"
            >Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use></svg
          ></a>
          <a
            href="javascript:void(0)"
            class="filterby stopPop"
            @click="showFilterPop"
            >Filter by</a
          >
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div
            class="filter stopPop"
            id="filter"
            :class="{ 'filterby-show': filterBy }"
          >
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd @click="priceChecked = 'all'">
                <a
                  href="javascript:void(0)"
                  :class="{ cur: priceChecked === 'all' }"
                  >All</a
                >
              </dd>
              <dd
                v-for="(item, index) in priceFilter"
                :key="index"
                @click="priceChecked = index"
              >
                <a
                  href="javascript:void(0)"
                  :class="{ cur: priceChecked === index }"
                  >{{ item.startPrice }} - {{ item.endPrice }}</a
                >
              </dd>
            </dl>
          </div>
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList" :key="item.productId">
                  <div class="pic">
                    <a href="#"
                      ><img v-lazy="`static/img/${item.productImg}`" alt=""
                    /></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.productPrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closeFilterPop"></div>
    <nav-footer />
  </div>
</template>
<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'
import axios from 'axios'
export default {
  name: 'GoodsList',
  data: () => ({
    goodsList: [],
    priceFilter: [
      { startPrice: 0, endPrice: 100 },
      { startPrice: 100, endPrice: 500 },
      { startPrice: 500, endPrice: 1000 },
      { startPrice: 1000, endPrice: 2000 }
    ],
    priceChecked: 'all',
    filterBy: false,
    overLayFlag: false
  }),
  components: { NavHeader, NavFooter, NavBread },
  mounted () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      axios.get('/static/goods.json').then((res) => {
        var result = res.data
        if (result.status === '0') {
          this.goodsList = result.list
          console.log(this.goodsList)
        }
      })
    },
    showFilterPop () {
      this.filterBy = true
      this.overLayFlag=true
    },
    closeFilterPop(){
      this.filterBy=false
      this.overLayFlag=false
    }
  }
}
</script>
