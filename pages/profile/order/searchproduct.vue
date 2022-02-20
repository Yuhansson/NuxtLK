<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card>
        <v-card-title>
          Подбор номенклатуры
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск"
            single-line
            hide-details
            @keyup.enter="searchProduct"
          ></v-text-field>
        </v-card-title>

        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="products"
          class="elevation-1"
          hide-default-footer
          show-select
          item-key="num"
        >
          <template #item.count="props">
            <v-edit-dialog
              :return-value.sync="props.item.count"
              large
              persistent
              cancel-text="Отмена"
              save-text="Сохранить"
              @save="save(props.item)"
              @cancel="cancel"
            >
              <div>{{ props.item.count }}</div>
              <template #input>
                <div class="mt-4 title">Введите количество</div>
                <v-text-field
                  v-model="props.item.count"
                  label="Редактировать"
                  single-line
                  counter
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template #footer>
            <div class="d-flex justify-end">
              <v-btn class="ma-1" @click="close">Закрыть</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="ma-1" @click="goPrev">Назад</v-btn>
              <v-btn class="ma-1" @click="goNext">Вперед</v-btn>
            </div>
          </template>
        </v-data-table>
        <v-data-table
          :headers="selHeaders"
          :items="selected"
          class="elevation-1"
          hide-default-footer
        >
          <template #item.actions="{ item }">
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template #footer>
            <div class="d-flex justify-end">
              <v-btn class="ma-1" @click="moveToOrder">Перенести в заказ</v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SearchProduct',
  data: () => ({
    search: '',
    headers: [
      { text: 'Наименование', value: 'title' },
      { text: 'Цена', value: 'price' },
      { text: 'Кол-во', value: 'count' },
    ],
    selected: [],
    products: [],
    prev: '',
    next: '',
    selHeaders: [
      { text: 'Наименование', value: 'title' },
      { text: 'Цена', value: 'price' },
      { text: 'Кол-во', value: 'count' },
      { text: '#', value: 'actions', sortable: false },
    ],
  }),
  computed: {
    loading() {
      return this.$store.getters.loading
    },
  },
  created() {
    this.getProducts()
  },
  methods: {
    searchProduct() {
      if (this.search === '') {
        this.getProducts()
      } else {
        this.getProducts('search')
      }
    },
    goPrev() {
      this.getProducts('prev')
    },
    goNext() {
      this.getProducts('next')
    },
    close() {
      this.$router.go(-1)
    },
    async getProducts(payload) {
      this.$store.commit('setLoading', true, { root: true })
      try {
        let url
        if (payload === undefined) {
          url = '/v1/products/'
        } else if (payload === 'prev') {
          url = `/v1/products?prev=${this.prev}`
        } else if (payload === 'next') {
          url = `/v1/products?next=${this.next}`
        } else if (payload === 'search') {
          url = `/v1/products?search=${this.search}`
        }

        const { errors, next, prev, results } = await this.$axios.$get(url)

        const res = results.map((product) => {
          const findSelectedProduct = this.selected.find(
            (selProduct) =>
              selProduct.uuid === product.uuid &&
              selProduct.characteristic === product.characteristic
          )
          if (findSelectedProduct !== undefined) {
            product.count = findSelectedProduct.count
          }
          return product
        })

        this.products = res
        this.prev = prev
        this.next = next
        if (errors.exist) {
          this.$store.commit('setError', errors.title, { root: true })
        }
      } catch (e) {
        this.$store.commit('setError', e, { root: true })
        throw e
      } finally {
        this.$store.commit('setLoading', false, { root: true })
      }
    },
    save(val) {
      const res = this.selected.find(
        (selProduct) =>
          selProduct.uuid === val.uuid &&
          selProduct.characteristic.uuid === val.characteristic.uuid
      )
      if (res === undefined) {
        this.selected.push(val)
      } else {
        res.count = val.count
      }
    },
    cancel() {},
    deleteItem(item) {
      this.selected.splice(this.selected.indexOf(item), 1)
    },
    moveToOrder() {
      this.$store.commit('order/pushSelected', this.selected)
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped></style>
