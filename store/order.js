export const state = () => ({
  order: {},
  stocks: [],
  stock: null,
  products: [],
  selected: [],
})

export const mutations = {
  setStocks(state, stocks) {
    state.stocks = stocks
  },
  setStock(state, stock) {
    state.stock = stock
  },
  setProducts(state, products) {
    state.products = products
  },
  pushSelected(state, selected) {
    selected.forEach((val) => {
      state.products.push(val)
    })
  },
  clearOrder(state) {
    state.order = {}
    state.products = []
    state.selected = []
  },
  deleteProduct(state, item) {
    state.products.splice(state.products.indexOf(item), 1)
  },
  setOrder(state, order) {
    if (order.length !== 0) {
      state.order = order[0]
      state.products = order[0].products
    }
  },
  setOrderStock(state, stock) {
    state.order.stock = stock
  },
}

export const actions = {
  async getOrderMeta({ commit }) {
    try {
      const { errors, meta } = await this.$axios.$get('/v1/meta')
      commit('setStocks', meta.stock)
      commit('setNds', meta.nds)
      if (errors.exist) {
        commit('setError', errors.title, { root: true })
      }
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async createOrder({ commit, getters }) {
    try {
      const newOrder = {
        stock: getters.stock,
        products: getters.products,
      }
      const { errors } = await this.$axios.$post('/v1/orders', newOrder)
      if (errors.exist) {
        commit('setError', errors.title, { root: true })
      } else {
        commit('setMessage', 'Заказ успешно создан', { root: true })
      }
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async deleteOrder({ commit }, uuid) {
    try {
      const { errors } = await this.$axios.$delete(`/v1/orders?order=${uuid}`)
      if (errors.exist) {
        commit('setError', errors.title, { root: true })
      } else {
        commit('setMessage', 'Заказ успешно удален', { root: true })
      }
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async getOrderDetail({ commit }, uuid) {
    try {
      const { errors, results, meta } = await this.$axios.$get(
        `/v1/orders?order=${uuid}`
      )
      commit('setOrder', results)
      commit('setStocks', meta.stock)
      if (errors.exist) {
        commit('setError', errors.title, { root: true })
      }
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async updateOrder({ commit, getters }) {
    try {
      const order = getters.order
      const { errors } = await this.$axios.$put(
        `/v1/orders?order=${order.uuid}`,
        order
      )
      if (errors.exist) {
        commit('setError', errors.title, { root: true })
      } else {
        commit('setMessage', 'Заказ успешно обновлен', { root: true })
      }
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
}

export const getters = {
  order: (state) => state.order,
  stocks: (state) => state.stocks,
  products: (state) => state.products,
  stock: (state) => state.stock,
  selected: (state) => state.selected,
  orderStock: (state) => state.order.stock,
}
