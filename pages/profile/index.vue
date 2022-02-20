<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <h1>Список заказов</h1>
      <v-btn class="mb-2" @click="addItem">Новый заказ</v-btn>
      <v-data-table
        :headers="headers"
        :items="orders"
        sort-by="date"
        class="elevation-1"
        hide-default-footer
      >
        <template #item.date="{ item }">
          {{ new Date(item.date).toLocaleString() }}
        </template>
        <template #item.actions="{ item }">
          <v-icon
            v-if="item.canChange"
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="item.canDelete"
            small
            class="mr-2"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <div class="mt-2">
        <v-btn @click="prev"> Назад </v-btn>
        <v-btn @click="next"> Вперед </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Profile',
  middleware: ['auth'],
  data: () => ({
    headers: [
      {
        text: 'Наименование',
        align: 'start',
        sortable: false,
        value: 'title',
      },
      { text: 'Дата', value: 'date' },
      { text: 'Статус', value: 'status' },
      {
        text: 'Действия',
        value: 'actions',
        sortable: false,
        align: 'end',
      },
    ],
  }),
  async fetch({ store }) {
    store.commit('setLoading', true)
    try {
      if (store.getters['orders/ordersList'].length === 0) {
        await store.dispatch('orders/getOrdersList')
      }
    } catch (e) {
      console.log(e)
    } finally {
      store.commit('setLoading', false)
    }
  },
  computed: {
    orders() {
      return this.$store.getters['orders/ordersList']
    },
  },
  methods: {
    editItem(item) {
      this.$router.push(`profile/order/${item.uuid}`)
    },
    deleteItem(item) {
      this.$store.commit('setLoading', true)
      this.$store.dispatch('order/deleteOrder', item.uuid).then(() => {
        this.$store.dispatch('orders/getOrdersList')
        this.$store.commit('setLoading', false)
      })
    },
    prev() {
      this.$store.dispatch('orders/getOrdersList', 'prev')
    },
    next() {
      this.$store.dispatch('orders/getOrdersList', 'next')
    },
    addItem() {
      this.$store.commit('order/clearOrder')
      this.$router.push('/profile/order/new')
    },
  },
}
</script>

<style scoped></style>
