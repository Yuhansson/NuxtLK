<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col>
            <v-text-field
              :value="order.num"
              label="Номер заказа"
              disabled
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :value="new Date(order.date).toLocaleString()"
              label="Дата заказа"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-select
          v-model="stock"
          :items="stocks"
          item-text="title"
          item-value="uuid"
          label="Склад"
          required
          return-object
          single-line
          class="mb-5"
        ></v-select>
        <v-btn class="mb-2" @click="addProduct">Подбор номенклатуры</v-btn>
        <v-data-table
          :headers="headers"
          :items="products"
          class="elevation-1 mb-2"
          hide-default-footer
        >
          <template #item.actions="{ item }">
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
        <v-btn :disabled="!valid" class="mr-4" @click="updateOrder">
          Обновить
        </v-btn>
        <v-btn class="mr-4" @click="goBack"> Отменить </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ProfileOrder',
  data: () => ({
    valid: false,
    headers: [
      { text: 'Наименование', value: 'title' },
      { text: 'Цена', value: 'price' },
      { text: 'Кол-во', value: 'count' },
      { text: '#', value: 'actions', sortable: false },
    ],
  }),
  async fetch({ store, params }) {
    store.commit('setLoading', true)
    try {
      if (store.getters['order/products'].length === 0) {
        await store.dispatch('order/getOrderDetail', params.uuid)
      }
    } catch (e) {
    } finally {
      store.commit('setLoading', false)
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    order() {
      return this.$store.getters['order/order']
    },
    stock: {
      get() {
        return this.$store.getters['order/orderStock']
      },
      set(value) {
        this.$store.commit('order/setOrderStock', value)
      },
    },
    stocks() {
      return this.$store.getters['order/stocks']
    },
    products() {
      return this.$store.getters['order/products']
    },
  },
  methods: {
    updateOrder() {
      this.$store.dispatch('order/updateOrder').then(() => {
        this.$router.push('/profile?message=updateOrder')
        this.$store.dispatch('orders/getOrdersList')
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    deleteItem(item) {
      this.$store.commit('order/deleteProduct', item)
    },
    addProduct() {
      this.$router.push('/profile/order/searchproduct')
    },
  },
}
</script>

<style scoped></style>
