<template>
  <div>
    <nav-header></nav-header>
    <nav-bread><span slot="bread">goods</span></nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" @click="sortGoods" class="price"
          >Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg
            >
          </a>
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
              <dd @click="switchPriceChecked('all')">
                <a
                  href="javascript:void(0)"
                  :class="{ cur: priceChecked === 'all' }"
                >All</a
                >
              </dd>
              <dd
                v-for="(item, index) in priceFilter"
                :key="index"
                @click="switchPriceChecked(index)"
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
                    ><img v-lazy="`static/img/${item.productImage}`" alt=""
                    /></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.salePrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <img src="./../assets/images/loading-cylon.svg" v-if="loadMoreLoading">
                <span v-if="!loadMoreLoading">到底了~</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closeFilterPop"></div>
    <nav-footer/>
  </div>
</template>
<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'
import axios from 'axios'

export default {
  name: 'GoodsList',
  data: () => ({
    goodsList: [],
    sortFlag: true,
    page: 1,
    pageSize: 8,
    busy: true,
    loadMoreLoading: false,
    priceFilter: [
      {startPrice: 0, endPrice: 100},
      {startPrice: 100, endPrice: 500},
      {startPrice: 500, endPrice: 1000},
      {startPrice: 1000, endPrice: 2000}
    ],
    priceChecked: 'all',
    filterBy: false,
    overLayFlag: false
  }),
  components: {NavHeader, NavFooter, NavBread},
  mounted () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList (flag = false) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : 0,
        priceLevel: this.priceChecked
      }
      this.loadMoreLoading = true
      axios.get(`/goods`, {params: param}).then((res) => {
        var result = res.data
        this.loadMoreLoading = false
        if (result.status === '0') {
          this.goodsList = flag ? this.goodsList.concat(result.result.list) : result.result.list
          if (result.result.count < this.pageSize) {
            this.busy = true
          } else {
            this.busy = false
          }
        } else {
          console.log(result.msg)
        }
      })
    },
    addCart (id) {
      axios.post('/goods/addCart', {
        productId: id
      }).then((res) => {
        if (res.data.status === '0') {
          alert('加入成功')
        } else {
          alert('msg:' + res.data.msg)
        }
      })
    },
    sortGoods () {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.getGoodsList()
    },
    switchPriceChecked (val) {
      this.priceChecked = val
      this.page = 1
      this.getGoodsList()
    },
    showFilterPop () {
      this.filterBy = true
      this.overLayFlag = true
    },
    closeFilterPop () {
      this.filterBy = false
      this.overLayFlag = false
    },
    loadMore () {
      this.busy = true
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 500)
    }
  }
}
</script>
<style>
  .load-more{text-align: center;}
</style>
