export const state = () => ({
  ordersList: [],
  prev: '',
  next: '',
})

export const mutations = {
  setOrdersList(state, orders) {
    state.ordersList = orders
  },
  setPrev(state, prev) {
    state.prev = prev
  },
  setNext(state, next) {
    state.next = next
  },
}

export const actions = {
  async getOrdersList({ commit, getters }, payload) {
    try {
      let url
      if (payload === undefined) {
        url = '/v1/orders/'
      } else if (payload === 'prev') {
        url = '/v1/orders?prev=' + getters.prev
      } else if (payload === 'next') {
        url = '/v1/orders?next=' + getters.next
      }
      const { errors, next, prev, results } = await this.$axios.$get(url)
      commit('setOrdersList', results)
      commit('setPrev', prev)
      commit('setNext', next)
      if (errors.exist) {
        commit('setError', errors.title, { root: true })
      }
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
}

export const getters = {
  ordersList: (state) => state.ordersList,
  prev: (state) => state.prev,
  next: (state) => state.next,
}
