<template>
  <div>
    <div v-if="Object.keys(this.$store.getters['cart/cart']).length">
      <v-row>
        <v-col lg="9" cols="12">
          <v-list-item
            threeLine
            v-for="list in this.$store.getters['cart/cart']"
            :key="list.index"
            :disabled="checkout"
          >
            <v-list-item-avatar size="100" class="hidden-xs-only mt-7">
              <v-img :src="imagesUrl + list.item.image"></v-img>
            </v-list-item-avatar>

            <v-list-item-content class="mx-auto">
              <v-col md="5" cols="12">
                <v-list-item-title
                  v-text="list.item.name"
                  class="text-h6 py-2"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-text="list.item.description"
                ></v-list-item-subtitle>
              </v-col>

              <v-col md="2" cols="3" class="mx-auto">
                {{ formatPrice(list) }}
              </v-col>

              <v-col md="2" cols="6" style="max-width:120px">
                <v-text-field
                  style="height:50px;"
                  :value="list.quantity"
                  class="mx-auto"
                  :prepend-icon="'mdi-minus'"
                  @click:prepend="decrease(list.item)"
                  :append-outer-icon="'mdi-plus'"
                  @click:append-outer="increase(list.item)"
                  readonly
                  solo
                  flat
                  type="text"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col md="2" cols="3" class="mx-auto">
                {{ formatPrice(list, true) }}
              </v-col>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                @click="remove(list.item)"
                class="my-10"
                large
                title="Remove"
              >
                <v-icon color="gray lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-col>

        <v-col lg="3" cols="12" class="my-sm-5">
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">Point</th>
                <th class="text-left">Price, {{ currencySymbol }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Products</td>
                <td>{{ calcTotal.products }}</td>
              </tr>
              <tr>
                <td>Delivery</td>
                <td>{{ calcTotal.delivery }}</td>
              </tr>
              <tr>
                <td class="text-h6">Total</td>
                <td>{{ calcTotal.total }}</td>
              </tr>
            </tbody>
          </v-simple-table>

          <v-col>
            <v-btn
              v-if="!checkout"
              @click="checkout = !checkout"
              color="red"
              class="float-lg-right"
              outlined
              large
              block
            >
              Checkout</v-btn
            >
          </v-col>
        </v-col>
      </v-row>

      <v-row>
        <v-row v-if="checkout">
          <v-col class="mx-auto my-10">
            <v-row justify="center">
              <v-col lg="6" md="9" sm="12">
                <v-card ref="form">
                  <v-card-text>
                    <v-text-field
                      ref="email"
                      v-model="form.email"
                      :readonly="!!form.email"
                      :rules="[rules.required, rules.emailValid]"
                      label="E-mail"
                      required
                    ></v-text-field>

                    <v-text-field
                      ref="name"
                      v-model="form.name"
                      :rules="[rules.required]"
                      label="Full Name"
                      required
                    >
                    </v-text-field>

                    <v-text-field
                      ref="city"
                      :rules="[rules.required]"
                      v-model="form.city"
                      label="City"
                      required
                    >
                    </v-text-field>

                    <v-text-field
                      ref="address"
                      :rules="[rules.required]"
                      v-model="form.address"
                      label="Address Line"
                      counter="50"
                      required
                    ></v-text-field>

                    <v-textarea
                      ref="comment"
                      rows="1"
                      v-model="form.comment"
                      label="Comment"
                      :rules="[() => true]"
                    >
                    </v-textarea>
                  </v-card-text>

                  <v-divider class="mb-4"></v-divider>

                  <v-card-actions>
                    <v-btn text @click="checkout = !checkout">
                      <v-icon>mdi-refresh</v-icon>Change order
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="red"
                      outlined
                      large
                      @click="submit"
                      :loading="loading"
                      >Place order</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-row>
    </div>

    <div v-else>
      <v-row>
        <v-col lg="9" sm="12">
          <div class="text-h5" v-if="orderId">
            Your order #{{ orderId }} placed
          </div>
          <div class="text-h5" v-else>Cart is empty</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col lg="9" sm="12" v-if="password">
          <div class="text-h6">
            You are registered and logged in. Please keep your password
          </div>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">Login</th>
                <th class="text-left">Password</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ form.email }}</td>
                <td>{{ password }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
        <v-col v-else-if="$store.accessToken === null">
          <div class="text-h6">
            Please, <nuxt-link to="/login">login</nuxt-link> to show your orders
            history
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  data: function() {
    return {
      checkout: false,
      errorMessages: "",
      formHasErrors: false,
      orderId: null,
      loading: false,
      password: null,
      imagesUrl: process.env.IMAGES_URL,
      rules: {
        required: value => !!value || "Required.",
        emailValid: value =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          ) || "E-mail must be valid"
      }
    };
  },
  computed: {
    ...mapState("user", {
      accessToken: state => state.accessToken,
      user: state => state.user
    }),
    currencySymbol() {
      return this.$store.getters["currency/currenciesSymbol"][
        this.$store.getters["currency/currency"]
      ];
    },
    calcTotal() {
      let delivery = parseFloat(
        Number(
          Object.keys(this.$store.getters["cart/cart"]).reduce(
            (sum, key) =>
              sum + this.$store.getters["cart/cart"][key].quantity * 1 || 0,
            0
          )
        ).toFixed(2)
      );
      let products = parseFloat(
        Number(
          Object.keys(this.$store.getters["cart/cart"]).reduce(
            (sum, key) =>
              sum +
                this.$store.getters["cart/cart"][key].quantity *
                  this.$store.getters["cart/cart"][key].item.price[
                    this.$store.getters["currency/currency"]
                  ] || 0,
            0
          )
        ).toFixed(2)
      );
      let total = parseFloat(products + delivery).toFixed(2);

      return {
        delivery: delivery,
        products: products,
        total: total
      };
    },
    form() {
      return {
        name: this.user.name || null,
        address: this.user.address || null,
        city: this.user.city || null,
        email: this.user.email || null,
        comment: this.comment || null
      };
    }
  },
  methods: {
    ...mapMutations({
      remove: "cart/remove",
      decrease: "cart/decrease",
      increase: "cart/increase",
      empty: "cart/empty",
      saveUser: "user/saveUser",
      saveAccessToken: "user/saveAccessToken"
    }),
    formatPrice(list, quantity = false) {
      return (
        (
          list.item.price[this.$store.getters["currency/currency"]] *
          (quantity ? list.quantity : 1)
        ).toFixed(2) +
        " " +
        this.currencySymbol
      );
    },
    validateForm() {
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (!this.$refs[f].valid) this.formHasErrors = true;
      });
      return this.formHasErrors;
    },
    submit() {
      const order = {
        ...this.form,
        deliveryPrice: this.calcTotal.delivery,
        currency: this.$store.getters["currency/currency"],
        purchases: this.$store.getters["cart/cart"]
      };

      !this.validateForm() ? this.sendOrder(order) : false;
    },

    async sendOrder(order) {
      this.loading = true;
      await this.$axios
        .$post(process.env.BACKEND_URL + "/orders", order)
        .then(response => {
          this.orderId = response.orderId;
          this.password = response.password;
          this.empty();
          if (response.accessToken) {
            this.saveUser({
              name: this.form.name,
              email: this.form.email,
              city: this.form.city,
              address: this.form.address
            });
            this.saveAccessToken(response.accessToken);
          }
        });
    }
  },
  mounted() {
    this.$store.commit("user/getUserFromStorage");
    this.$store.commit("user/getAccessTokenFromStorage");
  }
};
</script>

<style>
.v-input__control {
  min-width: 42px !important;
}
</style>
