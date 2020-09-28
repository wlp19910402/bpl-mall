import axios from 'axios'
import interFaceUrl from '@/util/interface'
const state = () => ({
  cartCount: 0
})
const mutations = {
  setCartCount (state, data) {
    state.cartCount = data
  }
}
const actions = {
  fetchCartCount ({commit}) {
    axios.get(`${interFaceUrl}users/cartList/len`).then(res => {
      let result = res.data
      if (result.status === '0') {
        commit('setCartCount', result.result)
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
