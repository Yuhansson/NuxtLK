export default function ({ $axios, store }) {
  $axios.interceptors.request.use((request) => {
    if (!request.headers.common.Authorization) {
      request.headers.common.Authorization = store.getters['auth/token']
      return request
    }
    return request
  })
}
