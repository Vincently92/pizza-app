<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel v-for="order of orders" :key="order.id">
        <v-expansion-panel-header>
          <v-col cols="6">Order #{{ order.id }}</v-col>
          <v-col cols="6">{{ formatDate(order.created_at) }}</v-col>
          <v-col cols="6">{{ order.city }} {{ order.address }}</v-col>
          <v-col cols="6"
            >{{ order.total.toFixed(2) }}
            {{
              $store.getters["currency/currenciesSymbol"][order.currency]
            }}</v-col
          >
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-list-item
            threeLine
            v-for="purchase in order.purchases"
            :key="purchase.id"
          >
            <v-list-item-avatar height="100" width="100" class="hidden-xs-only">
              <v-img :src="imagesUrl + purchase.product.image"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                v-text="purchase.product.name"
                class="text-lg-h6 py-2"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-text="purchase.product.description"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-content
              class="mx-auto text-center d-sm-none d-md-flex"
            >
              <div>
                {{ purchase.price }}
                {{
                  $store.getters["currency/currenciesSymbol"][order.currency]
                }}
              </div>
            </v-list-item-content>

            <v-list-item-content class="text-center" style="max-width:110px;">
              <v-text-field
                class="mx-auto text-center"
                style="height:50px;"
                :value="purchase.quantity"
                readonly
                solo
                flat
                type="text"
              ></v-text-field>
            </v-list-item-content>

            <v-list-item-content class="mx-auto text-center">
              <div>
                {{ (purchase.price * purchase.quantity).toFixed(2) }}
                {{
                  $store.getters["currency/currenciesSymbol"][order.currency]
                }}
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  data: () => ({
    imagesUrl: process.env.IMAGES_URL,
    orders: {}
  }),
  async mounted() {
    this.orders = await this.$axios.$get(process.env.BACKEND_URL + "/orders", {
      headers: {
        Authorization: `Bearer ${this.$store.getters["user/accessToken"]}`
      }
    });
  },
  methods: {
    formatDate(value) {
      return moment(String(value)).format("MM/DD/YYYY hh:mm");
    }
  }
};
</script>
