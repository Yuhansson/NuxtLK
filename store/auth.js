import Cookie from 'cookie'
import Cookies from 'js-cookie'

export const state = () => ({
  token: null,
})

export const mutations = {
  authAccess(state, token) {
    state.token = token
    Cookies.set('token', token)
  },
  logoutUser(state) {
    state.token = null
    Cookies.remove('token')
  },
}

export const actions = {
  async loginUser({ commit }, payload) {
    try {
      const response = await this.$axios.get('/echo/', {
        credentials: true,
        auth: {
          username: payload.username,
          password: payload.password,
        },
      })
      if (response.status === 200) {
        commit(
          'authAccess',
          'Basic ' + btoa(payload.username + ':' + payload.password)
        )
      }
      commit('setMessage', 'Вы вошли в личный кабинет', { root: true })
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  logoutUser({ commit }) {
    try {
      commit('logoutUser')
      commit('setMessage', 'Вы вышли из системы', { root: true })
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  autoLogin({ commit }) {
    const cookieStr = process.browser
      ? document.cookie
      : this.app.context.req.headers.cookie
    const cookies = Cookie.parse(cookieStr || '') || {}
    const token = cookies.token

    if (token) {
      commit('authAccess', token)
    } else {
      commit('logoutUser')
    }
  },
}

export const getters = {
  isLoggedIn: (state) => Boolean(state.token),
  token: (state) => state.token,
}
