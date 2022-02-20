<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-form ref="form" v-model="valid">
        <v-select
          v-model="stock"
          :items="stocks"
          item-text="title"
          item-value="uuid"
          label="Склад"
          required
          return-object
          single-line
          :rules="stockRules"
          class="mb-5"
        ></v-select>

        <v-btn class="mb-2" @click="addProduct">Подбор номенклатуры</v-btn>
        <v-data-table
          :headers="headers"
          :items="products"
          class="elevation-1"
          hide-default-footer
        >
          <template #item.actions="{ item }">
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>

        <v-btn
          class="mt-4"
          :disabled="!valid"
          :loading="loading"
          @click="submit"
        >
          Оформить заказ
        </v-btn>
        <v-btn class="mt-4" @click="exit"> Отмена </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'NewOrder',
  data: () => ({
    valid: false,
    stockRules: [(v) => !!v || 'Склад обязательное поле'],
    headers: [
      { text: 'Наименование', value: 'title' },
      { text: 'Цена', value: 'price' },
      { text: 'Кол-во', value: 'count' },
      { text: '#', value: 'actions', sortable: false },
    ],
  }),
  async fetch({ store }) {
    store.commit('setLoading', true)
    try {
      await store.dispatch('order/getOrderMeta')
    } catch (e) {
    } finally {
      store.commit('setLoading', false)
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    stocks() {
      return this.$store.getters['order/stocks']
    },
    products() {
      return this.$store.getters['order/products']
    },
    stock: {
      get() {
        return this.$store.getters['order/stock']
      },
      set(value) {
        this.$store.commit('order/setStock', value)
      },
    },
  },
  methods: {
    submit() {
      this.$store.dispatch('order/createOrder').then(() => {
        this.$router.push('/profile')
        this.$store.dispatch('orders/getOrdersList')
      })
    },
    exit() {
      this.$router.go(-1)
    },
    addProduct() {
      this.$router.push('/profile/order/searchproduct')
    },
    deleteItem(item) {
      this.$store.commit('order/deleteProduct', item)
    },
  },
}
</script>

<style scoped></style>
